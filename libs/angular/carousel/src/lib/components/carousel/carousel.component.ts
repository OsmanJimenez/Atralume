import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { TuiCarousel } from "@taiga-ui/core";
import { AtralumeButton } from "@atralume/angular/button";

export interface AtralumeCarouselSlide {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

/**
 * Thin carousel over Taiga `tui-carousel`.
 * Keeps the slides DTO; autoplay maps to `[duration]`.
 */
@Component({
  selector: "atr-carousel",
  standalone: true,
  imports: [TuiCarousel, AtralumeButton],
  templateUrl: "./carousel.component.html",
  styleUrl: "./carousel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-carousel" },
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

  protected readonly duration = computed(() =>
    this.autoplay() ? Math.max(1000, this.autoplayDelay()) : 0,
  );

  protected readonly max = computed(() =>
    Math.max(0, this.slides().length - 1),
  );

  protected onIndex(index: number): void {
    this.activeIndex.set(index);
    this.activeChange.emit(index);
  }

  next(): void {
    const length = this.slides().length;
    if (!length) return;
    const current = this.activeIndex();
    const next = current >= length - 1 ? (this.loop() ? 0 : current) : current + 1;
    this.onIndex(next);
  }

  previous(): void {
    const length = this.slides().length;
    if (!length) return;
    const current = this.activeIndex();
    const next = current <= 0 ? (this.loop() ? length - 1 : current) : current - 1;
    this.onIndex(next);
  }
}
