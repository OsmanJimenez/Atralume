import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import { AtralumeSliderBase, type AtralumeSliderRange } from "../../internal/slider-base";
@Component({
  selector: "atr-range-slider",
  standalone: true,
  templateUrl: "./range-slider.component.html",
  styleUrl: "../slider/slider.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeRangeSlider),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeRangeSlider),
      multi: true,
    },
  ],
  host: {
    class: "atr-slider atr-range-slider",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-inverted]": "inverted()",
    "[class.atr-slider--invalid]": "displayInvalid()",
  },
})
export class AtralumeRangeSlider
  extends AtralumeSliderBase<AtralumeSliderRange>
  implements Validator
{
  readonly minimum = input(0, {
    transform: (value: number | undefined) => value ?? 0,
  });
  readonly maximum = input(100, {
    transform: (value: number | undefined) => value ?? 100,
  });
  protected lower(): number {
    return this.minimum();
  }
  protected upper(): number {
    return this.maximum();
  }
  readonly startLabel = input<string | null>(null);
  readonly endLabel = input<string | null>(null);
  readonly displayed = computed(() => {
    const value = this.value();
    const start = this.normalize(value?.start ?? this.minimum()),
      end = this.normalize(value?.end ?? this.maximum());
    return { start: Math.min(start, end), end: Math.max(start, end) };
  });
  readonly startPercent = computed(() =>
    this.maximum() === this.minimum()
      ? 0
      : (100 * (this.displayed().start - this.minimum())) /
        (this.maximum() - this.minimum()),
  );
  readonly endPercent = computed(() =>
    this.maximum() === this.minimum()
      ? 0
      : (100 * (this.displayed().end - this.minimum())) /
        (this.maximum() - this.minimum()),
  );
  protected setStart(value: number): void {
    const current = this.displayed();
    this.commit({
      start: Math.min(current.end, this.normalize(value)),
      end: current.end,
    });
  }
  protected setEnd(value: number): void {
    const current = this.displayed();
    this.commit({
      start: current.start,
      end: Math.max(current.start, this.normalize(value)),
    });
  }
  protected input(event: Event, thumb: "start" | "end"): void {
    const input = event.target as HTMLInputElement;
    if (!this.blocked() && !this.readonly()) {
      if (thumb === "start") this.setStart(Number(input.value));
      else this.setEnd(Number(input.value));
    }
    input.value = String(this.displayed()[thumb]);
  }
  protected key(event: KeyboardEvent, thumb: "start" | "end"): void {
    this.page(event, this.displayed()[thumb], (value) =>
      thumb === "start" ? this.setStart(value) : this.setEnd(value),
    );
  }
  protected track(event: PointerEvent): void {
    if (
      this.blocked() ||
      this.readonly() ||
      (event.target as HTMLElement).tagName === "INPUT"
    )
      return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    let fraction =
      this.orientation() === "vertical"
        ? 1 - (event.clientY - rect.top) / rect.height
        : (event.clientX - rect.left) / rect.width;
    if (
      this.orientation() === "horizontal" &&
      this.element.matches(":dir(rtl)")
    )
      fraction = 1 - fraction;
    if (this.inverted()) fraction = 1 - fraction;
    const value = this.normalize(
        this.minimum() +
          Math.max(0, Math.min(1, fraction)) *
            (this.maximum() - this.minimum()),
      ),
      current = this.displayed();
    if (Math.abs(value - current.start) < Math.abs(value - current.end))
      this.setStart(value);
    else this.setEnd(value);
  }
  validate(): ValidationErrors | null {
    const value = this.value();
    return value === null
      ? this.required()
        ? { required: true }
        : null
      : !Number.isFinite(value.start) ||
          !Number.isFinite(value.end) ||
          value.start < this.minimum() ||
          value.end > this.maximum() ||
          value.start > value.end
        ? { sliderRange: true }
        : null;
  }
}
