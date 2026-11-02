import {
  Injectable,
  InjectionToken,
  inject,
  TemplateRef,
  Type,
  Injector,
  DestroyRef,
  ViewContainerRef,
} from "@angular/core";
import { Observable } from "rxjs";
import { ɵAtralumeOverlayInfrastructure } from "@atralume/angular";
export const ATR_DIALOG_DATA = new InjectionToken<unknown>(
  "AtralumeDialog data",
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
@Injectable({ providedIn: "root" })
export class AtralumeDialog {
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  open<T, D = unknown, R = unknown>(
    content: Type<T> | TemplateRef<T>,
    config: AtralumeDialogConfig<D> = {},
  ): AtralumeDialogRef<R> {
    const handle = this.engine.open<T, D, R>(content, {
      ...config,
      kind: "dialog",
      modal: true,
      providers: (handle) => [
        {
          provide: AtralumeDialogRef,
          useValue: new AtralumeDialogRef<R>(handle.afterClosed, handle.close),
        },
        { provide: ATR_DIALOG_DATA, useValue: config.data },
      ],
    });
    return new AtralumeDialogRef<R>(handle.afterClosed, handle.close);
  }
}
