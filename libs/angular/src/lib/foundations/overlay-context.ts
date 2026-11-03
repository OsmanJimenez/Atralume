import { RendererFactory2 } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  inject,
} from "@angular/core";

export type OverlayKind =
  | "tooltip"
  | "menu"
  | "snackbar"
  | "bottom-sheet"
  | "dialog"
  | "critical";

/**
 * Shared portal helpers for CDK Menu (theme attrs, token copy, Escape stack).
 * Dialog / bottom-sheet / popover / snackbar / tooltip open paths were removed
 * after those families moved onto Taiga services.
 */
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
  private readonly destroy = inject(DestroyRef);
  private readonly layers = new WeakMap<HTMLElement, number>();
  private layer = 0;

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
      this.dismissals.clear();
    });
  }

  registerDismissal(node: HTMLElement, close: () => void): () => void {
    const entry = { node, close };
    this.dismissals.add(entry);
    return () => this.dismissals.delete(entry);
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
      "data-atr-shape",
      "data-atr-brand",
    ]) {
      const value = source
        .closest<HTMLElement>("[" + attr + "]")
        ?.getAttribute(attr);
      if (value) panel.setAttribute(attr, value);
    }
    panel.setAttribute("dir", style.direction === "rtl" ? "rtl" : "ltr");
    panel.classList.add("atr-overlay-context", ...classes);
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
}
