import { computed, Directive, input, isDevMode } from "@angular/core";
@Directive()
export abstract class AtralumeProgress {
  readonly value = input<number | null>(null);
  readonly min = input(0);
  readonly max = input(100);
  readonly label = input.required<string>();
  protected readonly range = computed(() => {
    const min = this.min(),
      max = this.max(),
      value = this.value();
    if (!this.label().trim())
      throw new Error("Progress requires an accessible label.");
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min)
      throw new Error("Progress requires finite min < max.");
    if (value !== null && !Number.isFinite(value))
      throw new Error("Progress value must be finite or null.");
    if (value !== null && (value < min || value > max) && isDevMode())
      console.warn(
        "Atralume progress value is outside its range; clamped for display.",
      );
    return {
      min,
      max,
      value: value === null ? null : Math.min(max, Math.max(min, value)),
    };
  });
  protected readonly normalizedValue = computed(() => this.range().value);
  protected readonly percentage = computed(() => {
    const { min, max, value } = this.range();
    return value === null ? null : (100 * (value - min)) / (max - min);
  });
}
