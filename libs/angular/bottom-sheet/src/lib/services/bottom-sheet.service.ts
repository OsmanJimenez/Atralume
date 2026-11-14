import {
  Injectable,
  InjectionToken,
  inject,
  TemplateRef,
  Type,
  Injector,
  DestroyRef,
  ViewContainerRef,
  Component,
  ChangeDetectionStrategy,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Observable, Subject, Subscription } from "rxjs";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { ɵAtralumeOverlayInfrastructure } from "@atralume/angular";

/**
 * Bottom sheet over Taiga `TuiDialogService` with `appearance: atr-bottom-sheet`.
 * `TuiDrawer` is horizontal-only; sheet chrome is CSS on the dialog appearance.
 */
export const ATR_BOTTOM_SHEET_DATA = new InjectionToken<unknown>(
  "AtralumeBottomSheet data",
);

const ATR_BOTTOM_SHEET_TEMPLATE = new InjectionToken<TemplateRef<unknown>>(
  "AtralumeBottomSheet template",
);

export interface AtralumeBottomSheetConfig<D> {
  data?: D;
  origin?: HTMLElement;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  role?: "dialog" | "alertdialog";
  disableClose?: boolean;
  autoFocus?: "dialog" | "first-tabbable" | "first-heading";
  restoreFocus?: boolean;
  owner?: DestroyRef;
  injector?: Injector;
  viewContainerRef?: ViewContainerRef;
  contextClasses?: readonly string[];
  closeOnNavigation?: boolean;
  /** Retained for API compatibility; Taiga dialogs are modal. */
  mode?: "modal" | "standard";
}

export class AtralumeBottomSheetRef<R = unknown> {
  constructor(
    readonly afterClosed: Observable<R | undefined>,
    private readonly closeFn: (result?: R) => void,
  ) {}
  close(result?: R): void {
    this.closeFn(result);
  }
}

@Component({
  selector: "atr-bottom-sheet-template-host",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<ng-container *ngTemplateOutlet="template; injector: injector" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AtralumeBottomSheetTemplateHost {
  readonly template = inject(ATR_BOTTOM_SHEET_TEMPLATE);
  readonly injector = inject(Injector);
}

@Injectable({ providedIn: "root" })
export class AtralumeBottomSheet {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly overlays = inject(ɵAtralumeOverlayInfrastructure);

  open<T, D = unknown, R = unknown>(
    content: Type<T> | TemplateRef<T>,
    config: AtralumeBottomSheetConfig<D> = {},
  ): AtralumeBottomSheetRef<R> {
    const afterClosed = new Subject<R | undefined>();
    let subscription: Subscription | undefined;
    let closed = false;

    const finish = (result?: R) => {
      if (closed) return;
      closed = true;
      subscription?.unsubscribe();
      subscription = undefined;
      afterClosed.next(result);
      afterClosed.complete();
    };

    const sheetRef = new AtralumeBottomSheetRef<R>(
      afterClosed.asObservable(),
      (result) => finish(result),
    );

    const providers = [
      { provide: AtralumeBottomSheetRef, useValue: sheetRef },
      { provide: ATR_BOTTOM_SHEET_DATA, useValue: config.data },
    ];

    let polyContent: PolymorpheusComponent<unknown> | TemplateRef<T>;
    if (content instanceof TemplateRef) {
      const templateInjector = Injector.create({
        parent: config.injector ?? this.injector,
        providers: [
          ...providers,
          { provide: ATR_BOTTOM_SHEET_TEMPLATE, useValue: content },
        ],
      });
      polyContent = new PolymorpheusComponent(
        AtralumeBottomSheetTemplateHost,
        templateInjector,
      );
    } else {
      polyContent = new PolymorpheusComponent(
        content,
        Injector.create({
          parent: config.injector ?? this.injector,
          providers,
        }),
      );
    }

    subscription = this.dialogs
      .open<R>(polyContent, {
        label: config.label ?? "",
        dismissible: !config.disableClose,
        closable: !config.disableClose,
        data: config.data as D,
        appearance: "atr-bottom-sheet",
        size: "m",
      })
      .subscribe({
        next: (result) => finish(result),
        complete: () => finish(undefined),
        error: () => finish(undefined),
      });

    queueMicrotask(() => this.applyPortalChrome(config));

    config.owner?.onDestroy(() => sheetRef.close());

    return sheetRef;
  }

  private applyPortalChrome(config: AtralumeBottomSheetConfig<unknown>): void {
    // Portal chrome needs a real document; skip during SSR / non-browser.
    if (!this.overlays.browser) return;
    let seen = false;
    const bind = () => {
      const dialogs = document.querySelectorAll<HTMLElement>(
        'tui-modal[role="dialog"], tui-modal[role="alertdialog"]',
      );
      const modal = dialogs.item(dialogs.length - 1);
      if (!modal) return false;
      seen = true;
      const panel =
        modal.querySelector<HTMLElement>(
          'tui-dialog[data-appearance="atr-bottom-sheet"]',
        ) ?? modal;
      this.overlays.decorate(
        panel,
        config.origin,
        "bottom-sheet",
        config.contextClasses ?? [],
      );
      this.overlays.decorate(modal, config.origin, "bottom-sheet");
      // Re-apply a11y attrs every tick: Taiga may reset labelledBy after mount.
      if (
        config.labelledBy &&
        modal.ownerDocument.getElementById(config.labelledBy)
      ) {
        modal.setAttribute("aria-labelledby", config.labelledBy);
      }
      if (
        config.describedBy &&
        modal.ownerDocument.getElementById(config.describedBy)
      ) {
        modal.setAttribute("aria-describedby", config.describedBy);
      }
      if (config.role) modal.setAttribute("role", config.role);
      return modal.isConnected;
    };

    bind();
    let attempts = 0;
    const timer = globalThis.setInterval(() => {
      attempts += 1;
      const connected = bind();
      if (attempts >= 60 || (seen && !connected)) globalThis.clearInterval(timer);
    }, 16);
  }
}
