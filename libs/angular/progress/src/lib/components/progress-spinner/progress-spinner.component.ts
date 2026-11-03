import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { TuiLoader } from "@taiga-ui/core";
import { TuiProgressCircle } from "@taiga-ui/kit";
import { AtralumeProgress } from "../../models/progress";

export type ProgressSpinnerSize = "small" | "medium" | "large";

/**
 * Composition adapter over Taiga UI `TuiProgressCircle` / `TuiLoader`.
 * Keeps `atr-progress-spinner` and Atralume size/label/value API.
 */
@Component({
  selector: "atr-progress-spinner",
  standalone: true,
  imports: [TuiProgressCircle, TuiLoader],
  templateUrl: "./progress-spinner.component.html",
  styleUrl: "./progress-spinner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-progress-spinner",
    role: "progressbar",
    "[attr.aria-label]": "label()",
    "[attr.aria-valuemin]": "range().min",
    "[attr.aria-valuemax]": "range().max",
    "[attr.aria-valuenow]": "normalizedValue()",
    "[class.atr-progress--indeterminate]": "value() === null",
    "[attr.data-size]": "size()",
  },
})
export class AtralumeProgressSpinner extends AtralumeProgress {
  readonly size = input<ProgressSpinnerSize>("medium");

  protected readonly tuiSize = computed(() => {
    switch (this.size()) {
      case "small":
        return "s" as const;
      case "large":
        return "l" as const;
      default:
        return "m" as const;
    }
  });

  protected readonly circleMax = computed(() => {
    const { min, max } = this.range();
    return max - min;
  });

  protected readonly circleValue = computed(() => {
    const { min, value } = this.range();
    return value === null ? 0 : value - min;
  });
}
