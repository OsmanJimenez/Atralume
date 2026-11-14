import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { NgStyle } from "@angular/common";
import { AtralumeButton } from "@osmanjimenez/atralume/button";

/**
 * Accessible, dependency-free viewer for equirectangular (2:1) panorama images.
 * Drag or use the keyboard to explore the scene; the image repeats seamlessly on
 * the horizontal axis so a visitor can make a complete 360-degree turn.
 */
@Component({
  selector: "atr-image-360",
  standalone: true,
  imports: [NgStyle, AtralumeButton],
  templateUrl: "./image-360.component.html",
  styleUrl: "./image-360.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-image-360",
    "[attr.aria-label]": "label()",
  },
})
export class AtralumeImage360 {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly label = input("Vista panorámica 360 grados");
  readonly yaw = signal(50);
  readonly zoom = signal(1);
  protected readonly sceneStyle = computed(() => ({
    "background-image": `url("${this.src()}")`,
    "background-position": `${this.yaw()}% 50%`,
    "background-size": `${Math.round(200 * this.zoom())}% auto`,
  }));
  private dragStart: { x: number; yaw: number } | null = null;

  protected startDrag(event: PointerEvent): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    target.setPointerCapture(event.pointerId);
    this.dragStart = { x: event.clientX, yaw: this.yaw() };
  }

  protected drag(event: PointerEvent): void {
    if (!this.dragStart) return;
    this.rotate(this.dragStart.yaw - (event.clientX - this.dragStart.x) * 0.12);
  }

  protected endDrag(): void {
    this.dragStart = null;
  }

  protected onKey(event: KeyboardEvent): void {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => this.rotate(this.yaw() - 3),
      ArrowRight: () => this.rotate(this.yaw() + 3),
      "+": () => this.changeZoom(0.1),
      "=": () => this.changeZoom(0.1),
      "-": () => this.changeZoom(-0.1),
      Home: () => this.reset(),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.changeZoom(event.deltaY > 0 ? -0.1 : 0.1);
  }

  protected rotate(value: number): void {
    this.yaw.set(((value % 100) + 100) % 100);
  }

  protected changeZoom(delta: number): void {
    this.zoom.update((value) => Math.max(1, Math.min(2.25, Number((value + delta).toFixed(2)))));
  }

  protected reset(): void {
    this.yaw.set(50);
    this.zoom.set(1);
  }

  protected async fullscreen(event: MouseEvent): Promise<void> {
    const host = (event.currentTarget as HTMLElement | null)?.closest("atr-image-360");
    if (host instanceof HTMLElement && document.fullscreenElement !== host) {
      await host.requestFullscreen?.();
    }
  }
}
