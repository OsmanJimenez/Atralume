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
export const ATR_BOTTOM_SHEET_DATA = new InjectionToken<unknown>(
  "AtralumeBottomSheet data",
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
@Injectable({ providedIn: "root" })
export class AtralumeBottomSheet {
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  open<T, D = unknown, R = unknown>(
    content: Type<T> | TemplateRef<T>,
    config: AtralumeBottomSheetConfig<D> = {},
  ): AtralumeBottomSheetRef<R> {
    const handle = this.engine.open<T, D, R>(content, {
      ...config,
      kind: "bottom-sheet",
      modal: config.mode !== "standard",
      providers: (handle) => [
        {
          provide: AtralumeBottomSheetRef,
          useValue: new AtralumeBottomSheetRef<R>(
            handle.afterClosed,
            handle.close,
          ),
        },
        { provide: ATR_BOTTOM_SHEET_DATA, useValue: config.data },
      ],
    });
    return new AtralumeBottomSheetRef<R>(handle.afterClosed, handle.close);
  }
}
