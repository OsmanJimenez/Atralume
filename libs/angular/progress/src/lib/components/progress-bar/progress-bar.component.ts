import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { TuiProgressBar } from "@taiga-ui/kit";
import { AtralumeProgress } from "../../models/progress";

/**
 * Composition adapter over Taiga UI `TuiProgressBar`.
 * Keeps the public `atr-progress-bar` element and Atralume progress inputs.
 */
@Component({
  selector: "atr-progress-bar",
  standalone: true,
  imports: [TuiProgressBar],
  templateUrl: "./progress-bar.component.html",
  styleUrl: "./progress-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-progress-bar",
    "[attr.aria-label]": "null",
    "[class.atr-progress--indeterminate]": "value() === null",
  },
})
export class AtralumeProgressBar extends AtralumeProgress {
  /** Native progress max mapped from Atralume min/max. */
  protected readonly nativeMax = computed(() => {
    const { min, max } = this.range();
    return max - min;
  });

  /** Native progress value mapped into 0..nativeMax, or null when indeterminate. */
  protected readonly nativeValue = computed(() => {
    const { min, value } = this.range();
    return value === null ? null : value - min;
  });
}
