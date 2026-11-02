import {
  Directive,
  booleanAttribute,
  input,
  computed,
  effect,
  untracked,
} from "@angular/core";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
export interface AtralumeSliderRange {
  readonly start: number;
  readonly end: number;
}
/** @internal Native range controls retain pointer/touch/keyboard behavior. */
@Directive({ host: { "[style.--atr-slider-ticks]": "ticks()" } })
export abstract class AtralumeSliderBase<T> extends ɵAtralumeValueControl<T> {
  protected abstract lower(): number;
  protected abstract upper(): number;
  readonly step = input(1);
  readonly continuous = input(false, { transform: booleanAttribute });
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly inverted = input(false, { transform: booleanAttribute });
  readonly showTicks = input(false, { transform: booleanAttribute });
  readonly displayWith = input<(value: number) => string>(String);
  private validatorChanged: () => void = () => undefined;
  protected readonly ticks = computed(() =>
    this.showTicks() &&
    !this.continuous() &&
    this.upper() > this.lower() &&
    this.step() > 0
      ? "repeating-linear-gradient(var(--atr-slider-direction,to right), var(--atr-comp-slider-tick-color) 0 1px, transparent 1px " +
        (100 * this.step()) / (this.upper() - this.lower()) +
        "%)"
      : "none",
  );
  constructor() {
    super();
    effect(() => {
      this.value();
      this.lower();
      this.upper();
      this.step();
      this.required();
      untracked(() => this.validatorChanged());
    });
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
  normalize(value: number): number {
    const min = this.lower(),
      max = this.upper(),
      step = this.step();
    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      max < min ||
      (!this.continuous() && (!Number.isFinite(step) || step <= 0))
    )
      throw new Error(
        "Slider requires finite ordered bounds and a positive step.",
      );
    const clamped = Math.max(
      min,
      Math.min(max, Number.isFinite(value) ? value : min),
    );
    if (this.continuous()) return Number(clamped.toFixed(12));
    const decimal = (n: number) => {
      const [coefficient, exponent = "0"] = String(n).toLowerCase().split("e");
      return Math.max(
        0,
        (coefficient.split(".")[1]?.length ?? 0) - Number(exponent),
      );
    };
    const factor =
      10 ** Math.min(12, Math.max(decimal(min), decimal(max), decimal(step)));
    const lo = Math.round(min * factor),
      hi = Math.round(max * factor),
      increment = Math.max(1, Math.round(step * factor));
    return (
      (lo +
        Math.min(
          Math.floor((hi - lo) / increment),
          Math.max(0, Math.round((clamped * factor - lo) / increment)),
        ) *
          increment) /
      factor
    );
  }
  protected guard(event: Event): void {
    if (this.readonly()) event.preventDefault();
  }
  protected page(
    event: KeyboardEvent,
    current: number,
    change: (value: number) => void,
  ): void {
    if (this.readonly()) {
      event.preventDefault();
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      change(
        this.normalize(
          current +
            ((event.key === "PageUp" ? 1 : -1) *
              (this.upper() - this.lower())) /
              10,
        ),
      );
    }
  }
}
