import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { NgStyle } from "@angular/common";
import { AtralumeButton } from "@osmanjimenez/atralume/button";

type DragSample = { t: number; x: number; y: number };
type PointerPose = { id: number; x: number; y: number };

type DeviceOrientationPermission = {
  requestPermission?: () => Promise<"granted" | "denied" | "default">;
};

/**
 * Immersive equirectangular (2:1) panorama viewer.
 * Drag + inertia, pinch zoom, optional DeviceOrientation gyro, and a light
 * stereo/VR split for phone cardboard / fullscreen comfort — no WebGL dependency.
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
    "[class.atr-image-360--vr]": "vr()",
    "[class.atr-image-360--gyro]": "gyroActive()",
    "[class.atr-image-360--chrome-visible]": "chromeVisible()",
    "[attr.aria-label]": "label()",
    "[attr.data-status]": "status()",
  },
})
export class AtralumeImage360 {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly label = input("Vista panorámica 360 grados");
  readonly enableGyro = input(true, { transform: booleanAttribute });
  readonly enableVr = input(true, { transform: booleanAttribute });
  readonly initialYaw = input(180);
  readonly initialPitch = input(0);

  protected readonly yaw = signal(180);
  protected readonly pitch = signal(0);
  protected readonly zoom = signal(1);
  protected readonly gyroActive = signal(false);
  protected readonly vr = signal(false);
  protected readonly chromeVisible = signal(true);
  protected readonly hintVisible = signal(true);
  protected readonly status = signal<"idle" | "loading" | "ready" | "error">(
    "loading",
  );
  protected readonly gyroSupported = signal(false);
  protected readonly gyroDenied = signal(false);

  protected readonly yawLabel = computed(() => `${Math.round(this.yaw())}°`);
  protected readonly pitchClamp = computed(() =>
    Math.max(-28, Math.min(28, this.pitch())),
  );
  protected readonly sceneStyle = computed(() => this.buildSceneStyle(0));
  protected readonly sceneStyleRight = computed(() => this.buildSceneStyle(2.4));
  protected readonly ariaDescription = computed(() => {
    const parts = [
      this.label(),
      this.alt(),
      "Arrastra para mirar. Pellizca o usa + y − para zoom.",
    ];
    if (this.enableGyro() && this.gyroSupported()) {
      parts.push("Activa el giroscopio para mover el teléfono.");
    }
    if (this.enableVr()) {
      parts.push("VR abre una vista estereoscópica.");
    }
    parts.push("Flechas del teclado también giran la escena.");
    return parts.join(" ");
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pointers = new Map<number, PointerPose>();
  private dragOrigin: {
    x: number;
    y: number;
    yaw: number;
    pitch: number;
  } | null = null;
  private pinchOrigin: { distance: number; zoom: number } | null = null;
  private samples: DragSample[] = [];
  private velocity = { yaw: 0, pitch: 0 };
  private inertiaFrame = 0;
  private chromeTimer = 0;
  private hintTimer = 0;
  private reducedMotion = false;
  private orientationHandler: ((event: DeviceOrientationEvent) => void) | null =
    null;
  private gyroBase: { alpha: number; beta: number } | null = null;
  private imageProbe: HTMLImageElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      this.gyroSupported.set(
        "DeviceOrientationEvent" in window ||
          "ondeviceorientation" in window,
      );
    }

    this.destroyRef.onDestroy(() => {
      this.stopInertia();
      this.detachGyro();
      window.clearTimeout(this.chromeTimer);
      window.clearTimeout(this.hintTimer);
      this.imageProbe = null;
      if (document.fullscreenElement === this.host.nativeElement) {
        void document.exitFullscreen?.();
      }
    });

    effect(() => {
      const src = this.src();
      this.preload(src);
    });

    // Defer initial orientation until first CD cycle so inputs are readable.
    queueMicrotask(() => {
      this.yaw.set(this.normalizeYaw(this.initialYaw()));
      this.pitch.set(this.clampPitch(this.initialPitch()));
      if (!this.reducedMotion) {
        this.hintTimer = window.setTimeout(
          () => this.hintVisible.set(false),
          5200,
        );
      } else {
        this.hintVisible.set(false);
      }
    });
  }

  protected startPointer(event: PointerEvent): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    // Chrome controls live inside the stage; ignore them so buttons keep click.
    if (
      event.target instanceof Element &&
      event.target.closest(
        "button, a, input, label, .atr-image-360__chrome, .atr-image-360__state",
      )
    ) {
      return;
    }
    target.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    });
    this.stopInertia();
    this.showChrome();
    this.hintVisible.set(false);

    if (this.pointers.size === 1) {
      this.dragOrigin = {
        x: event.clientX,
        y: event.clientY,
        yaw: this.yaw(),
        pitch: this.pitch(),
      };
      this.samples = [{ t: performance.now(), x: event.clientX, y: event.clientY }];
      this.pinchOrigin = null;
    } else if (this.pointers.size === 2) {
      this.dragOrigin = null;
      this.pinchOrigin = {
        distance: this.pointerDistance(),
        zoom: this.zoom(),
      };
    }
  }

  protected movePointer(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    });

    if (this.pointers.size >= 2 && this.pinchOrigin) {
      const distance = this.pointerDistance();
      if (distance > 0 && this.pinchOrigin.distance > 0) {
        const ratio = distance / this.pinchOrigin.distance;
        this.setZoom(this.pinchOrigin.zoom * ratio);
      }
      return;
    }

    if (!this.dragOrigin) return;
    const dx = event.clientX - this.dragOrigin.x;
    const dy = event.clientY - this.dragOrigin.y;
    const sensitivity = 0.18 / this.zoom();
    this.yaw.set(this.normalizeYaw(this.dragOrigin.yaw - dx * sensitivity));
    this.pitch.set(this.clampPitch(this.dragOrigin.pitch + dy * sensitivity * 0.55));

    const now = performance.now();
    this.samples.push({ t: now, x: event.clientX, y: event.clientY });
    if (this.samples.length > 5) this.samples.shift();
  }

  protected endPointer(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.delete(event.pointerId);

    if (this.pointers.size === 1) {
      const remaining = [...this.pointers.values()][0];
      this.dragOrigin = {
        x: remaining.x,
        y: remaining.y,
        yaw: this.yaw(),
        pitch: this.pitch(),
      };
      this.pinchOrigin = null;
      this.samples = [{ t: performance.now(), x: remaining.x, y: remaining.y }];
      return;
    }

    if (this.pointers.size === 0) {
      this.dragOrigin = null;
      this.pinchOrigin = null;
      this.launchInertia();
      this.scheduleChromeHide();
    }
  }

  protected onKey(event: KeyboardEvent): void {
    const step = event.shiftKey ? 12 : 4;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => this.nudgeYaw(-step),
      ArrowRight: () => this.nudgeYaw(step),
      ArrowUp: () => this.nudgePitch(-step * 0.45),
      ArrowDown: () => this.nudgePitch(step * 0.45),
      "+": () => this.changeZoom(0.12),
      "=": () => this.changeZoom(0.12),
      "-": () => this.changeZoom(-0.12),
      Home: () => this.reset(),
      Escape: () => {
        if (this.vr()) this.toggleVr(false);
      },
      g: () => void this.toggleGyro(),
      G: () => void this.toggleGyro(),
      v: () => this.toggleVr(),
      V: () => this.toggleVr(),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    this.showChrome();
    this.hintVisible.set(false);
    action();
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.showChrome();
    this.changeZoom(event.deltaY > 0 ? -0.1 : 0.1);
  }

  protected onSceneActivate(): void {
    this.showChrome();
  }

  protected changeZoom(delta: number): void {
    this.setZoom(this.zoom() + delta);
  }

  protected reset(): void {
    this.stopInertia();
    this.yaw.set(this.normalizeYaw(this.initialYaw()));
    this.pitch.set(this.clampPitch(this.initialPitch()));
    this.zoom.set(1);
    this.gyroBase = null;
    this.showChrome();
  }

  protected async toggleGyro(): Promise<void> {
    if (!this.enableGyro() || !this.gyroSupported()) return;
    if (this.gyroActive()) {
      this.detachGyro();
      this.gyroActive.set(false);
      this.showChrome();
      return;
    }

    const Orientation = DeviceOrientationEvent as unknown as DeviceOrientationPermission;
    if (typeof Orientation.requestPermission === "function") {
      try {
        const result = await Orientation.requestPermission();
        if (result !== "granted") {
          this.gyroDenied.set(true);
          return;
        }
      } catch {
        this.gyroDenied.set(true);
        return;
      }
    }

    this.gyroDenied.set(false);
    this.gyroBase = null;
    this.orientationHandler = (event: DeviceOrientationEvent) => {
      if (event.alpha == null || event.beta == null) return;
      if (!this.gyroBase) {
        this.gyroBase = { alpha: event.alpha, beta: event.beta };
      }
      const yawDelta = this.shortestAngle(event.alpha - this.gyroBase.alpha);
      const pitchDelta = event.beta - this.gyroBase.beta;
      this.yaw.set(this.normalizeYaw(this.initialYaw() - yawDelta));
      this.pitch.set(this.clampPitch(this.initialPitch() + pitchDelta * 0.35));
    };
    window.addEventListener("deviceorientation", this.orientationHandler, true);
    this.gyroActive.set(true);
    this.hintVisible.set(false);
    this.showChrome();
  }

  protected toggleVr(force?: boolean): void {
    if (!this.enableVr()) return;
    const next = force ?? !this.vr();
    this.vr.set(next);
    this.showChrome();
    if (next) {
      void this.enterFullscreen();
    }
  }

  protected async fullscreen(): Promise<void> {
    await this.enterFullscreen();
    this.showChrome();
  }

  protected retryLoad(): void {
    this.preload(this.src());
  }

  private async enterFullscreen(): Promise<void> {
    const el = this.host.nativeElement;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen?.();
        return;
      }
      await el.requestFullscreen?.();
    } catch {
      // Embedded previews (Storybook iframe) often block fullscreen; VR still works inline.
    }
  }

  private preload(src: string): void {
    this.status.set("loading");
    const img = new Image();
    this.imageProbe = img;
    img.decoding = "async";
    img.onload = () => {
      if (this.imageProbe !== img) return;
      this.status.set("ready");
    };
    img.onerror = () => {
      if (this.imageProbe !== img) return;
      this.status.set("error");
    };
    img.src = src;
  }

  private buildSceneStyle(yawOffsetDeg: number): Record<string, string> {
    const yaw = this.normalizeYaw(this.yaw() + yawOffsetDeg);
    const pitch = this.pitchClamp();
    const zoom = this.zoom();
    // Horizontal: percentage of the repeating strip. Vertical: shift within cover.
    const x = (yaw / 360) * 100;
    const y = 50 - pitch;
    return {
      "background-image": `url("${this.src()}")`,
      "background-position": `${x}% ${y}%`,
      "background-size": `${Math.round(220 * zoom)}% auto`,
    };
  }

  private pointerDistance(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    const [a, b] = pts;
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private launchInertia(): void {
    if (this.reducedMotion || this.samples.length < 2) return;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = Math.max(16, last.t - first.t);
    const sensitivity = 0.18 / this.zoom();
    this.velocity = {
      yaw: -((last.x - first.x) / dt) * sensitivity * 16,
      pitch: ((last.y - first.y) / dt) * sensitivity * 0.55 * 16,
    };
    if (Math.abs(this.velocity.yaw) < 0.05 && Math.abs(this.velocity.pitch) < 0.03) {
      return;
    }
    const tick = () => {
      this.velocity.yaw *= 0.92;
      this.velocity.pitch *= 0.9;
      if (
        Math.abs(this.velocity.yaw) < 0.02 &&
        Math.abs(this.velocity.pitch) < 0.015
      ) {
        this.stopInertia();
        return;
      }
      this.yaw.set(this.normalizeYaw(this.yaw() + this.velocity.yaw));
      this.pitch.set(this.clampPitch(this.pitch() + this.velocity.pitch));
      this.inertiaFrame = requestAnimationFrame(tick);
    };
    this.inertiaFrame = requestAnimationFrame(tick);
  }

  private stopInertia(): void {
    if (this.inertiaFrame) {
      cancelAnimationFrame(this.inertiaFrame);
      this.inertiaFrame = 0;
    }
    this.velocity = { yaw: 0, pitch: 0 };
  }

  private detachGyro(): void {
    if (this.orientationHandler) {
      window.removeEventListener(
        "deviceorientation",
        this.orientationHandler,
        true,
      );
      this.orientationHandler = null;
    }
    this.gyroBase = null;
  }

  private showChrome(): void {
    this.chromeVisible.set(true);
    this.scheduleChromeHide();
  }

  private scheduleChromeHide(): void {
    window.clearTimeout(this.chromeTimer);
    this.chromeTimer = window.setTimeout(() => {
      if (!this.gyroActive() && !this.vr() && this.pointers.size === 0) {
        this.chromeVisible.set(false);
      }
    }, 4200);
  }

  private nudgeYaw(delta: number): void {
    this.stopInertia();
    this.yaw.set(this.normalizeYaw(this.yaw() + delta));
  }

  private nudgePitch(delta: number): void {
    this.stopInertia();
    this.pitch.set(this.clampPitch(this.pitch() + delta));
  }

  private setZoom(value: number): void {
    this.zoom.set(Math.max(1, Math.min(2.6, Number(value.toFixed(2)))));
  }

  private normalizeYaw(value: number): number {
    return ((value % 360) + 360) % 360;
  }

  private clampPitch(value: number): number {
    return Math.max(-28, Math.min(28, value));
  }

  private shortestAngle(delta: number): number {
    const wrapped = ((delta + 180) % 360) - 180;
    return wrapped < -180 ? wrapped + 360 : wrapped;
  }
}
