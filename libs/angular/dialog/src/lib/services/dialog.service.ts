import {
  Injectable,
  InjectionToken,
  Injector,
  TemplateRef,
  Type,
  inject,
  DestroyRef,
  ViewContainerRef,
  Component,
  ChangeDetectionStrategy,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Observable, Subject, Subscription } from "rxjs";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { ɵAtralumeOverlayInfrastructure } from "@osmanjimenez/atralume";

export const ATR_DIALOG_DATA = new InjectionToken<unknown>(
  "AtralumeDialog data",
);

const ATR_DIALOG_TEMPLATE = new InjectionToken<TemplateRef<unknown>>(
  "AtralumeDialog template",
);

export interface AtralumeDialogConfig<D> {
  data?: D;
  origin?: HTMLElement;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  role?: "dialog" | "alertdialog";
  disableClose?: boolean;
  /** When false, hides Taiga's header close control. Escape/backdrop still follow `disableClose`. */
  closable?: boolean;
  /** Taiga dialog size. `l` for wide surfaces; `null` sizes to content. */
  size?: "s" | "m" | "l" | null;
  /** Taiga `data-appearance`. Defaults to `atr-dialog`. */
  appearance?: string;
  autoFocus?: "dialog" | "first-tabbable" | "first-heading";
  restoreFocus?: boolean;
  owner?: DestroyRef;
  injector?: Injector;
  viewContainerRef?: ViewContainerRef;
  contextClasses?: readonly string[];
  closeOnNavigation?: boolean;
}

export class AtralumeDialogRef<R = unknown> {
  constructor(
    readonly afterClosed: Observable<R | undefined>,
    private readonly closeFn: (result?: R) => void,
  ) {}
  close(result?: R): void {
    this.closeFn(result);
  }
}

@Component({
  selector: "atr-dialog-template-host",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<ng-container *ngTemplateOutlet="template; injector: injector" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AtralumeDialogTemplateHost {
  readonly template = inject(ATR_DIALOG_TEMPLATE);
  readonly injector = inject(Injector);
}

/**
 * Adapter over Taiga UI `TuiDialogService`.
 * Preserves AtralumeDialog / AtralumeDialogRef / ATR_DIALOG_DATA.
 */
@Injectable({ providedIn: "root" })
export class AtralumeDialog {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly overlays = inject(ɵAtralumeOverlayInfrastructure);

  open<T, D = unknown, R = unknown>(
    content: Type<T> | TemplateRef<T>,
    config: AtralumeDialogConfig<D> = {},
  ): AtralumeDialogRef<R> {
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

    const dialogRef = new AtralumeDialogRef<R>(
      afterClosed.asObservable(),
      (result) => finish(result),
    );

    const providers = [
      { provide: AtralumeDialogRef, useValue: dialogRef },
      { provide: ATR_DIALOG_DATA, useValue: config.data },
    ];

    let polyContent: PolymorpheusComponent<unknown> | TemplateRef<T>;
    if (content instanceof TemplateRef) {
      const templateInjector = Injector.create({
        parent: config.injector ?? this.injector,
        providers: [
          ...providers,
          { provide: ATR_DIALOG_TEMPLATE, useValue: content },
        ],
      });
      polyContent = new PolymorpheusComponent(
        AtralumeDialogTemplateHost,
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
        // Taiga only accepts a string title. labelledBy is applied to the
        // portaled tui-modal after mount (see applyAccessibilityAttrs).
        label: config.label ?? "",
        dismissible: !config.disableClose,
        closable: config.closable ?? !config.disableClose,
        size: config.size === undefined ? "m" : config.size,
        data: config.data as D,
        appearance: config.appearance ?? "atr-dialog",
      })
      .subscribe({
        next: (result) => finish(result),
        complete: () => finish(undefined),
        error: () => finish(undefined),
      });

    queueMicrotask(() =>
      this.applyPortalChrome(config),
    );

    config.owner?.onDestroy(() => dialogRef.close());

    return dialogRef;
  }

  /**
   * Taiga portals outside the trigger tree. Re-apply labelledBy/describedBy and
   * copy theme/dir/token context onto the mounted modal + dialog hosts.
   */
  private applyPortalChrome(config: AtralumeDialogConfig<unknown>): void {
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
          `tui-dialog[data-appearance="${config.appearance ?? "atr-dialog"}"]`,
        ) ?? modal;
      this.overlays.decorate(
        panel,
        config.origin,
        "dialog",
        config.contextClasses ?? [],
      );
      // Keep theme attrs on the role=dialog host for accessible queries.
      this.overlays.decorate(modal, config.origin, "dialog");
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
