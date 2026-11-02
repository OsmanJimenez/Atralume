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
import { AtralumeSliderBase } from "../../internal/slider-base";
@Component({
  selector: "atr-slider",
  standalone: true,
  templateUrl: "./slider.component.html",
  styleUrl: "./slider.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeSlider),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeSlider),
      multi: true,
    },
  ],
  host: {
    class: "atr-slider",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-inverted]": "inverted()",
    "[class.atr-slider--invalid]": "displayInvalid()",
  },
})
export class AtralumeSlider
  extends AtralumeSliderBase<number>
  implements Validator
{
  readonly min = input(0, {
    transform: (value: number | undefined) => value ?? 0,
  });
  readonly max = input(100, {
    transform: (value: number | undefined) => value ?? 100,
  });
  protected lower(): number {
    return this.min();
  }
  protected upper(): number {
    return this.max();
  }
  readonly displayed = computed(() =>
    this.normalize(this.value() ?? this.min()),
  );
  readonly fill = computed(() =>
    this.max() === this.min()
      ? 0
      : (100 * (this.displayed() - this.min())) / (this.max() - this.min()),
  );
  protected input(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!this.blocked() && !this.readonly())
      this.commit(this.normalize(Number(input.value)));
    input.value = String(this.displayed());
  }
  protected key(event: KeyboardEvent): void {
    this.page(event, this.displayed(), (value) => this.commit(value));
  }
  validate(): ValidationErrors | null {
    const value = this.value();
    return value === null
      ? this.required()
        ? { required: true }
        : null
      : !Number.isFinite(value) || value < this.min() || value > this.max()
        ? { sliderBounds: true }
        : null;
  }
}
