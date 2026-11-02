import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AtralumeProgress } from "../../models/progress";

@Component({
  selector: "atr-progress-bar",
  standalone: true,
  templateUrl: "./progress-bar.component.html",
  styleUrl: "./progress-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-progress-bar",
    role: "progressbar",
    "[attr.aria-label]": "label()",
    "[attr.aria-valuemin]": "range().min",
    "[attr.aria-valuemax]": "range().max",
    "[attr.aria-valuenow]": "normalizedValue()",
    "[class.atr-progress--indeterminate]": "value() === null",
  },
})
export class AtralumeProgressBar extends AtralumeProgress {}
