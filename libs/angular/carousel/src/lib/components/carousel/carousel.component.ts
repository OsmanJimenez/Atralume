import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

export interface AtralumeCarouselSlide {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}
@Component({
  selector: "atr-carousel",
  standalone: true,
  templateUrl: "./carousel.component.html",
  styleUrl: "./carousel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-carousel", "(mouseenter)": "pause()", "(mouseleave)": "resume()", "(focusin)": "pause()", "(focusout)": "resume()", "(keydown)": "key($event)" },
})
export class AtralumeCarousel {
  readonly label = input("Carousel");
  readonly slides = input<readonly AtralumeCarouselSlide[]>([]);
  readonly activeIndex = model(0);
  readonly loop = input(false, { transform: booleanAttribute });
  readonly autoplay = input(false, { transform: booleanAttribute });
  readonly autoplayDelay = input(5000);
  readonly showIndicators = input(true, { transform: booleanAttribute });
  readonly activeChange = output<number>();
  readonly paused = signal(true);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly active = computed(() => this.slides()[this.safeIndex()]);
  readonly canPrevious = computed(() => this.loop() || this.safeIndex() > 0);
  readonly canNext = computed(() => this.loop() || this.safeIndex() < this.slides().length - 1);
  constructor() {
    effect((cleanup) => {
      const enabled = this.autoplay() && !this.paused() && !this.reducedMotion() && !this.document.hidden;
      if (!enabled || !this.slides().length) return;
      const timer = setInterval(() => this.next(), Math.max(1000, this.autoplayDelay()));
      cleanup(() => clearInterval(timer));
    });
    const visibility = () => this.document.hidden ? this.pause() : this.resume();
    this.document.addEventListener("visibilitychange", visibility);
    this.destroyRef.onDestroy(() => this.document.removeEventListener("visibilitychange", visibility));
    if (this.autoplay() && !this.reducedMotion()) this.paused.set(false);
  }
  private reducedMotion(): boolean { return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  private safeIndex(): number { const length = this.slides().length; return length ? Math.max(0, Math.min(this.activeIndex(), length - 1)) : 0; }
  goTo(index: number): void {
    const length = this.slides().length; if (!length) return;
    const target = this.loop() ? (index + length) % length : Math.max(0, Math.min(index, length - 1));
    if (target !== this.safeIndex()) { this.activeIndex.set(target); this.activeChange.emit(target); }
  }
  next(): void { this.goTo(this.safeIndex() + (this.canNext() ? 1 : 0)); }
  previous(): void { this.goTo(this.safeIndex() - (this.canPrevious() ? 1 : 0)); }
  pause(): void { this.paused.set(true); }
  resume(): void { if (this.autoplay() && !this.reducedMotion() && !this.document.hidden) this.paused.set(false); }
  protected key(event: KeyboardEvent): void { if (event.key === "ArrowRight") { event.preventDefault(); this.next(); } else if (event.key === "ArrowLeft") { event.preventDefault(); this.previous(); } }
}
