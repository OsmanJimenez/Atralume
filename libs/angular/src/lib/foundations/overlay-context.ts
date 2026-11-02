import { RendererFactory2 } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  DestroyRef,
  Injectable,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  StaticProvider,
} from "@angular/core";
import { Dialog } from "@angular/cdk/dialog";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { BreakpointObserver } from "@angular/cdk/layout";
import { FocusTrapFactory } from "@angular/cdk/a11y";
import { ReplaySubject, Observable, Subscription } from "rxjs";
export type OverlayKind =
  "tooltip" | "menu" | "snackbar" | "bottom-sheet" | "dialog" | "critical";
export interface OverlayHandle<R> {
  readonly afterClosed: Observable<R | undefined>;
  close(result?: R): void;
}
/** @internal Shared connected panels for selection and interactive content. */
export interface ConnectedOverlayOptions {
  position?: "above" | "below" | "before" | "after";
  owner?: DestroyRef;
  context?: Record<string, unknown>;
  focus?: "none" | "first" | "trap";
  restoreFocus?: boolean;
  hasBackdrop?: boolean;
  matchWidth?: boolean;
  panelClass?: string;
}
export interface OverlayOptions<D = unknown, R = unknown> {
  origin?: HTMLElement;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  role?: "dialog" | "alertdialog";
  data?: D;
  modal?: boolean;
  disableClose?: boolean;
  autoFocus?: "dialog" | "first-tabbable" | "first-heading";
  restoreFocus?: boolean;
  owner?: DestroyRef;
  injector?: Injector;
  viewContainerRef?: ViewContainerRef;
  contextClasses?: readonly string[];
  closeOnNavigation?: boolean;
  kind?: OverlayKind;
  position?: "top" | "bottom";
  placement?: "center" | "start";
  providers?: (handle: OverlayHandle<R>) => StaticProvider[];
  context?: Record<string, unknown>;
}
/** Internal bridge: public families wrap this API and do not expose CDK references. */
@Injectable({ providedIn: "root" })
export class AtralumeOverlayInfrastructure {
  readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer = inject(RendererFactory2).createRenderer(
    null,
    null,
  );
  private readonly dismissals = new Set<{
    node: HTMLElement;
    close: () => void;
  }>();
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly destroy = inject(DestroyRef);
  private readonly overlays = inject(Overlay);
  private readonly dialogs = inject(Dialog);
  private readonly media = inject(BreakpointObserver);
  private readonly focusTraps = inject(FocusTrapFactory);
  private readonly handles = new Set<OverlayHandle<unknown>>();
  private readonly layers = new WeakMap<HTMLElement, number>();
  private layer = 0;
  private readonly tooltips = new WeakMap<HTMLElement, () => void>();
  constructor() {
    const unlisten = this.browser
      ? this.renderer.listen(
          this.document,
          "keydown",
          (event: KeyboardEvent) => {
            if (
              event.key !== "Escape" ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            )
              return;
            const top = [...this.dismissals]
              .reverse()
              .find((entry) => entry.node.isConnected);
            if (top) {
              event.preventDefault();
              event.stopImmediatePropagation();
              top.close();
            }
          },
          { capture: true },
        )
      : undefined;
    this.destroy.onDestroy(() => {
      unlisten?.();
      for (const handle of [...this.handles]) handle.close();
      this.dismissals.clear();
    });
  }
  registerDismissal(node: HTMLElement, close: () => void): () => void {
    const entry = { node, close };
    this.dismissals.add(entry);
    return () => this.dismissals.delete(entry);
  }
  tooltipOwner(origin: HTMLElement, close: () => void): () => void {
    const scope =
      origin.closest<HTMLElement>("[data-atr-theme]") ??
      this.document.documentElement;
    this.tooltips.get(scope)?.();
    this.tooltips.set(scope, close);
    return () => {
      if (this.tooltips.get(scope) === close) this.tooltips.delete(scope);
    };
  }
  decorate(
    panel: HTMLElement,
    origin?: HTMLElement,
    kind: OverlayKind = "dialog",
    classes: readonly string[] = [],
  ): void {
    if (!this.browser) return;
    const source = origin ?? this.document.documentElement;
    const style = this.document.defaultView?.getComputedStyle(source);
    if (!style) return;
    for (const attr of [
      "data-atr-theme",
      "data-atr-surface",
      "data-atr-density",
    ]) {
      const value = source
        .closest<HTMLElement>("[" + attr + "]")
        ?.getAttribute(attr);
      if (value) panel.setAttribute(attr, value);
    }
    panel.setAttribute("dir", style.direction === "rtl" ? "rtl" : "ltr");
    panel.classList.add("atr-overlay-context", ...classes);
    // Only the documented Atralume token namespaces cross the portal boundary.
    for (let i = 0; i < style.length; i++) {
      const key = style.item(i);
      if (/^--atr-(sys|comp|ref)-/.test(key))
        panel.style.setProperty(key, style.getPropertyValue(key));
    }
    const roleLayer = panel.closest<HTMLElement>(".cdk-overlay-pane") ?? panel;
    let order = this.layers.get(roleLayer);
    if (order === undefined) {
      order = ++this.layer;
      this.layers.set(roleLayer, order);
    }
    const z = `calc(var(--atr-sys-overlay-z-index-${kind}) + ${order} * var(--atr-sys-overlay-stack-step))`;
    roleLayer.style.zIndex = z;
    if (
      roleLayer.parentElement?.classList.contains("cdk-global-overlay-wrapper")
    )
      roleLayer.parentElement.style.zIndex = z;
  }
  connected(
    origin: HTMLElement,
    position: "above" | "below" | "before" | "after" = "below",
    scroll: "reposition" | "close" = "reposition",
    options: { hasBackdrop?: boolean } = {},
  ): OverlayRef | null {
    if (!this.browser) return null;
    const vertical = position === "above" || position === "below";
    const primary = vertical
      ? {
          originX: "center" as const,
          originY:
            position === "above" ? ("top" as const) : ("bottom" as const),
          overlayX: "center" as const,
          overlayY:
            position === "above" ? ("bottom" as const) : ("top" as const),
        }
      : {
          originX:
            position === "before" ? ("start" as const) : ("end" as const),
          originY: "center" as const,
          overlayX:
            position === "before" ? ("end" as const) : ("start" as const),
          overlayY: "center" as const,
        };
    const fallback = {
      ...primary,
      originY:
        primary.originY === "top"
          ? ("bottom" as const)
          : primary.originY === "bottom"
            ? ("top" as const)
            : primary.originY,
      overlayY:
        primary.overlayY === "top"
          ? ("bottom" as const)
          : primary.overlayY === "bottom"
            ? ("top" as const)
            : primary.overlayY,
      originX: !vertical
        ? primary.originX === "start"
          ? ("end" as const)
          : ("start" as const)
        : primary.originX,
      overlayX: !vertical
        ? primary.overlayX === "start"
          ? ("end" as const)
          : ("start" as const)
        : primary.overlayX,
    };
    const gap =
      parseFloat(
        this.document.defaultView
          ?.getComputedStyle(origin)
          .getPropertyValue("--atr-sys-overlay-position-gap") ?? "8",
      ) || 8;
    const positions = [primary, fallback].map((p) => ({
      ...p,
      offsetY: vertical ? (p.originY === "top" ? -gap : gap) : 0,
      offsetX: !vertical
        ? (p.originX === "start" ? -gap : gap) *
          (origin.matches(":dir(rtl)") ? -1 : 1)
        : 0,
    }));
    return this.overlays.create({
      hasBackdrop: options.hasBackdrop ?? false,
      backdropClass: "cdk-overlay-transparent-backdrop",
      positionStrategy: this.overlays
        .position()
        .flexibleConnectedTo(origin)
        .withPositions(positions)
        .withViewportMargin(gap)
        .withPush(true),
      scrollStrategy:
        scroll === "close"
          ? this.overlays.scrollStrategies.close()
          : this.overlays.scrollStrategies.reposition(),
      direction:
        this.document.defaultView?.getComputedStyle(origin).direction === "rtl"
          ? "rtl"
          : "ltr",
      disposeOnNavigation: "url-change",
    });
  }
  openConnected<T, R = unknown>(
    template: TemplateRef<T>,
    views: ViewContainerRef,
    origin: HTMLElement,
    options: ConnectedOverlayOptions = {},
  ): OverlayHandle<R> {
    const closed = new ReplaySubject<R | undefined>(1);
    const subscriptions = new Subscription();
    let done = false;
    const ref = this.connected(origin, options.position, "reposition", options);
    const handle: OverlayHandle<R> = {
      afterClosed: closed.asObservable(),
      close: (result) => {
        if (done) return;
        done = true;
        subscriptions.unsubscribe();
        this.handles.delete(handle);
        ref?.dispose();
        if (options.restoreFocus && origin.isConnected) origin.focus();
        closed.next(result);
        closed.complete();
      },
    };
    if (!ref) {
      handle.close();
      return handle;
    }
    this.handles.add(handle);
    const owner = options.owner ?? views.injector.get(DestroyRef);
    subscriptions.add(owner.onDestroy(() => handle.close()));
    if (options.matchWidth)
      ref.updateSize({ minWidth: origin.getBoundingClientRect().width });
    ref.overlayElement.classList.add(
      options.panelClass ?? "atr-connected-panel",
    );
    this.decorate(ref.overlayElement, origin, "menu");
    ref.attach(new TemplatePortal(template, views, options.context as T));
    subscriptions.add(
      this.registerDismissal(ref.overlayElement, () => handle.close()),
    );
    subscriptions.add(ref.detachments().subscribe(() => handle.close()));
    subscriptions.add(ref.backdropClick().subscribe(() => handle.close()));
    subscriptions.add(
      ref.outsidePointerEvents().subscribe((event) => {
        if (!origin.contains(event.target as Node)) handle.close();
      }),
    );
    if (options.focus && options.focus !== "none") {
      const trap = this.focusTraps.create(ref.overlayElement);
      subscriptions.add(() => trap.destroy());
      void trap.focusInitialElementWhenReady().then(() => {
        if (options.focus === "first") trap.enabled = false;
      });
    }
    return handle;
  }
  open<T, D, R>(
    content: Type<T> | TemplateRef<T>,
    options: OverlayOptions<D, R> = {},
  ): OverlayHandle<R> {
    const closed = new ReplaySubject<R | undefined>(1);
    let nativeClose: ((result?: R) => void) | undefined;
    let done = false;
    let queued: R | undefined;
    let early = false;
    const handle: OverlayHandle<R> = {
      afterClosed: closed.asObservable(),
      close: (result) => {
        if (done) return;
        if (nativeClose) nativeClose(result);
        else {
          early = true;
          queued = result;
        }
      },
    };
    if (!this.browser) {
      done = true;
      closed.next(undefined);
      closed.complete();
      return handle;
    }
    if (
      options.modal !== false &&
      !options.label?.trim() &&
      !options.labelledBy?.trim()
    )
      throw new Error("Atralume modal requires label or labelledBy.");
    if (
      options.modal === false &&
      content instanceof TemplateRef &&
      !options.viewContainerRef
    )
      throw new Error("Standard template overlays require viewContainerRef.");
    const owner =
      options.owner ??
      options.viewContainerRef?.injector.get(DestroyRef) ??
      this.destroy;
    const providers = options.providers?.(handle) ?? [];
    const subscriptions = new Subscription();
    const finish = (result?: R) => {
      if (done) return;
      done = true;
      subscriptions.unsubscribe();
      this.handles.delete(handle);
      closed.next(result);
      closed.complete();
    };
    this.handles.add(handle);
    const unregister = owner.onDestroy(() => handle.close());
    subscriptions.add(unregister);
    const origin =
      options.origin ??
      (this.document.activeElement as HTMLElement | null) ??
      undefined;
    const kind = options.kind ?? "dialog";
    if (options.modal !== false) {
      const ref = this.dialogs.open<R, D, T>(content, {
        data: options.data,
        injector: options.injector,
        viewContainerRef: options.viewContainerRef,
        providers,
        templateContext: {
          ...options.context,
          overlay: handle,
          dialogRef: handle,
        },
        ariaLabel: options.label,
        ariaLabelledBy: options.labelledBy,
        ariaDescribedBy: options.describedBy,
        ariaModal: false,
        role: options.role ?? "dialog",
        disableClose: options.disableClose ?? false,
        autoFocus: options.autoFocus ?? "first-tabbable",
        restoreFocus: options.restoreFocus === false ? false : (origin ?? true),
        closeOnNavigation:
          options.closeOnNavigation === false ? false : "url-change",
        panelClass: ["atr-modal-panel", "atr-" + kind + "-panel"],
        backdropClass: "atr-overlay-backdrop",
        positionStrategy:
          options.placement === "start"
            ? origin?.matches(":dir(rtl)")
              ? this.overlays.position().global().right("0").top("0")
              : this.overlays.position().global().left("0").top("0")
            : kind === "bottom-sheet"
              ? this.overlays
                  .position()
                  .global()
                  .centerHorizontally()
                  .bottom("0")
              : undefined,
        maxWidth: "calc(100vw - 2rem)",
        maxHeight:
          options.placement === "start" ? "100dvh" : "calc(100dvh - 2rem)",
        disableAnimations: true,
      });
      nativeClose = (result) => ref.close(result);
      subscriptions.add(
        this.registerDismissal(ref.overlayRef.overlayElement, () => {
          if (!options.disableClose) handle.close();
        }),
      );
      this.decorate(
        ref.overlayRef.overlayElement,
        origin,
        kind,
        options.contextClasses,
      );
      subscriptions.add(
        this.media
          .observe("(prefers-color-scheme: dark)")
          .subscribe(() =>
            this.decorate(
              ref.overlayRef.overlayElement,
              origin,
              kind,
              options.contextClasses,
            ),
          ),
      );
      if (ref.overlayRef.backdropElement)
        ref.overlayRef.backdropElement.style.zIndex =
          ref.overlayRef.overlayElement.style.zIndex;
      subscriptions.add(ref.closed.subscribe((result) => finish(result)));
    } else {
      const ref = this.overlays.create({
        hasBackdrop: false,
        positionStrategy:
          options.position === "top"
            ? this.overlays
                .position()
                .global()
                .centerHorizontally()
                .top("max(1rem, env(safe-area-inset-top))")
            : this.overlays
                .position()
                .global()
                .centerHorizontally()
                .bottom("max(1rem, env(safe-area-inset-bottom))"),
        scrollStrategy: this.overlays.scrollStrategies.reposition(),
        disposeOnNavigation:
          options.closeOnNavigation === false ? false : "url-change",
        panelClass: ["atr-floating-panel", "atr-" + kind + "-panel"],
      });
      const injector = Injector.create({
        parent:
          options.injector ??
          options.viewContainerRef?.injector ??
          this.injector,
        providers,
      });
      if (content instanceof TemplateRef)
        ref.attach(
          new TemplatePortal(
            content as TemplateRef<Record<string, unknown>>,
            options.viewContainerRef ?? injector.get(ViewContainerRef),
            { $implicit: options.data, ...options.context, overlay: handle },
            injector,
          ),
        );
      else
        ref.attach(
          new ComponentPortal(content, options.viewContainerRef, injector),
        );
      this.decorate(ref.overlayElement, origin, kind, options.contextClasses);
      let closing = false;
      nativeClose = (result) => {
        closing = true;
        ref.dispose();
        if (options.restoreFocus !== false && origin?.isConnected)
          origin.focus();
        finish(result);
      };
      subscriptions.add(
        this.registerDismissal(ref.overlayElement, () => {
          if (!options.disableClose) handle.close();
        }),
      );
      subscriptions.add(
        ref.keydownEvents().subscribe((event) => {
          if (event.key === "Escape" && !options.disableClose) {
            event.stopPropagation();
            event.preventDefault();
            handle.close();
          }
        }),
      );
      subscriptions.add(
        ref.detachments().subscribe(() => {
          if (!closing) finish();
        }),
      );
      subscriptions.add(
        this.media
          .observe("(prefers-color-scheme: dark)")
          .subscribe(() =>
            this.decorate(
              ref.overlayElement,
              origin,
              kind,
              options.contextClasses,
            ),
          ),
      );
    }
    if (early) nativeClose(queued);
    return handle;
  }
}
