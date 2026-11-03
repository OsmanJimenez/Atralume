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

export const ATR_DIALOG_DATA = new InjectionToken<unknown>("AtralumeDialog data");

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
  template: `<ng-container *ngTemplateOutlet="template" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AtralumeDialogTemplateHost {
  readonly template = inject(ATR_DIALOG_TEMPLATE);
}

/**
 * Adapter over Taiga UI `TuiDialogService`.
 * Preserves AtralumeDialog / AtralumeDialogRef / ATR_DIALOG_DATA.
 */
@Injectable({ providedIn: "root" })
export class AtralumeDialog {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);

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
        label: config.label ?? "",
        dismissible: !config.disableClose,
        closable: !config.disableClose,
        data: config.data as D,
        appearance: "atr-dialog",
      })
      .subscribe({
        next: (result) => finish(result),
        complete: () => finish(undefined),
        error: () => finish(undefined),
      });

    config.owner?.onDestroy(() => dialogRef.close());

    return dialogRef;
  }
}
