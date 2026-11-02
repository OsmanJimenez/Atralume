import {
  Directive,
  input,
  booleanAttribute,
  inject,
  ElementRef,
  DestroyRef,
  Renderer2,
} from "@angular/core";
import { ComponentPortal } from "@angular/cdk/portal";
import type { OverlayRef } from "@angular/cdk/overlay";
import { ɵAtralumeOverlayInfrastructure } from "@atralume/angular";
import { AtralumeTooltipPanel } from "../components/tooltip-panel/tooltip-panel.component";
import { Subscription } from "rxjs";
export type TooltipPosition = "above" | "below" | "before" | "after";
@Directive({
  selector: "[atrTooltip]",
  standalone: true,
  exportAs: "atrTooltip",
  host: {
    class: "atr-tooltip-trigger",
    "(pointerenter)": "show()",
    "(pointerleave)": "scheduleHide()",
    "(focusin)": "show()",
    "(focusout)": "scheduleHide()",
    "(pointerdown)": "touch($event)",
  },
})
export class AtralumeTooltip {
  readonly atrTooltip = input.required<string>();
  readonly tooltipId = input.required<string>();
  readonly position = input<TooltipPosition>("above");
  readonly showDelay = input(500);
  readonly hideDelay = input(150);
  readonly tooltipDisabled = input(false, { transform: booleanAttribute });
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private readonly host =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private ref: OverlayRef | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private subscription = new Subscription();
  private release: (() => void) | undefined;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }
  show(delay = this.showDelay()): void {
    this.clearTimer();
    if (
      !this.engine.browser ||
      this.tooltipDisabled() ||
      !this.atrTooltip().trim() ||
      this.ref
    )
      return;
    this.timer = setTimeout(() => this.attach(), Math.max(0, delay));
  }
  private attach(): void {
    if (this.ref || this.tooltipDisabled()) return;
    this.release = this.engine.tooltipOwner(this.host, () => this.hide());
    const ref = this.engine.connected(this.host, this.position());
    if (!ref) return;
    this.ref = ref;
    const panel = ref.attach(new ComponentPortal(AtralumeTooltipPanel));
    panel.setInput("text", this.atrTooltip());
    panel.setInput("id", this.tooltipId());
    this.engine.decorate(ref.overlayElement, this.host, "tooltip");
    const ids = new Set(
      (this.host.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter(Boolean),
    );
    ids.add(this.tooltipId());
    this.renderer.setAttribute(
      this.host,
      "aria-describedby",
      [...ids].join(" "),
    );
    this.subscription = new Subscription();
    this.subscription.add(
      this.engine.registerDismissal(ref.overlayElement, () => this.hide()),
    );
    this.subscription.add(
      ref.keydownEvents().subscribe((event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          this.hide();
        }
      }),
    );
    this.subscription.add(
      ref.outsidePointerEvents().subscribe((event) => {
        if (!this.host.contains(event.target as Node)) this.hide();
      }),
    );
    this.subscription.add(ref.detachments().subscribe(() => this.hide()));
    this.subscription.add(
      this.renderer.listen(ref.overlayElement, "pointerenter", () =>
        this.clearTimer(),
      ),
    );
    this.subscription.add(
      this.renderer.listen(ref.overlayElement, "pointerleave", () =>
        this.scheduleHide(),
      ),
    );
  }
  scheduleHide(): void {
    this.clearTimer();
    this.timer = setTimeout(() => this.hide(), Math.max(0, this.hideDelay()));
  }
  hide(): void {
    this.clearTimer();
    this.subscription.unsubscribe();
    const ref = this.ref;
    this.ref = null;
    ref?.dispose();
    this.release?.();
    this.release = undefined;
    const ids = (this.host.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter((id) => id && id !== this.tooltipId());
    if (ids.length)
      this.renderer.setAttribute(this.host, "aria-describedby", ids.join(" "));
    else this.renderer.removeAttribute(this.host, "aria-describedby");
  }
  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
  protected touch(event: PointerEvent): void {
    if (event.pointerType === "touch") {
      if (this.ref) this.hide();
      else this.show(0);
    }
  }
}
