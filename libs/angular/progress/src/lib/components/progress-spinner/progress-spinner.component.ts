import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AtralumeProgress } from "../../models/progress";
export type ProgressSpinnerSize = "small" | "medium" | "large";
@Component({
  selector: "atr-progress-spinner",
  standalone: true,
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
}
