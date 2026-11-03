import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  untracked,
} from "@angular/core";
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import { TuiRange } from "@taiga-ui/kit";
import {
  AtralumeSliderBase,
  type AtralumeSliderRange,
} from "../../internal/slider-base";

/**
 * Thin range recipe over Taiga `tui-range`.
 * Public value stays `{ start, end }`; inner FormControl syncs `[number, number]`
 * to the Taiga CVA (no stacked ngModel).
 */
@Component({
  selector: "atr-range-slider",
  standalone: true,
  imports: [ReactiveFormsModule, TuiRange],
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

  /** Visual tick count for Taiga `TuiRange` segments. */
  protected readonly segments = computed(() =>
    this.showTicks() && !this.continuous() && this.step() > 0
      ? Math.max(
          1,
          Math.round((this.maximum() - this.minimum()) / this.step()),
        )
      : 1,
  );

  protected readonly rangeStep = computed(() =>
    this.continuous() ? Math.max(0.01, (this.maximum() - this.minimum()) / 1000) : this.step(),
  );

  /** Inner CVA host for Taiga `tui-range`. */
  protected readonly inner = new FormControl<[number, number]>([0, 100], {
    nonNullable: true,
  });

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const sub = this.inner.valueChanges.subscribe((tuple) => {
      const [start, end] = tuple;
      const next = {
        start: this.normalize(start),
        end: this.normalize(end),
      };
      const current = this.displayed();
      if (current.start !== next.start || current.end !== next.end) {
        this.commit({
          start: Math.min(next.start, next.end),
          end: Math.max(next.start, next.end),
        });
      }
    });
    destroyRef.onDestroy(() => sub.unsubscribe());
    effect(() => {
      const next = this.displayed();
      untracked(() => {
        const [a, b] = this.inner.value;
        if (a !== next.start || b !== next.end) {
          this.inner.setValue([next.start, next.end], { emitEvent: false });
        }
      });
    });
    effect(() => {
      if (this.blocked()) this.inner.disable({ emitEvent: false });
      else this.inner.enable({ emitEvent: false });
    });
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
