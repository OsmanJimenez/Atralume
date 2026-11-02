import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  input,
} from "@angular/core";
import { ɵATR_FORM_FIELD_CONTROL } from "@atralume/angular";
export type AtralumeFormFieldAppearance = "outline" | "filled";
export type AtralumeFormFieldDensity = "comfortable" | "compact";
@Component({
  selector: "atr-form-field",
  standalone: true,
  templateUrl: "./form-field.component.html",
  styleUrl: "./form-field.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-form-field",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-density]": "density()",
    "[class.atr-form-field--disabled]": "control()?.disabled()",
    "[class.atr-form-field--readonly]": "control()?.readonly()",
    "[class.atr-form-field--invalid]": "!!error() || control()?.invalid()",
    "[class.atr-form-field--focused]": "control()?.focused()",
  },
})
export class AtralumeFormField {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly optionalText = input("Optional");
  readonly appearance = input<AtralumeFormFieldAppearance>("outline");
  readonly density = input<AtralumeFormFieldDensity>("comfortable");
  protected readonly control = contentChild(ɵATR_FORM_FIELD_CONTROL);
  protected readonly hintId = computed(
    () => this.control()?.controlId() + "-hint",
  );
  protected readonly errorId = computed(
    () => this.control()?.controlId() + "-error",
  );
  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      control?.setDescribedByIds([
        ...(this.hint() ? [this.hintId()] : []),
        ...(this.error() ? [this.errorId()] : []),
      ]);
      onCleanup(() => control?.setDescribedByIds([]));
    });
  }
}
