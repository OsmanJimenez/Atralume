import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
} from "@angular/core";
import { TuiSegmented } from "@taiga-ui/kit";

export type AtralumeContentSwitcherSize = "s" | "m" | "l";

/**
 * Thin adapter over Taiga UI `TuiSegmented` for mutually exclusive content modes.
 * Project buttons or links as options.
 */
@Component({
  selector: "atr-content-switcher",
  standalone: true,
  imports: [TuiSegmented],
  templateUrl: "./content-switcher.component.html",
  styleUrl: "./content-switcher.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-content-switcher",
    "[attr.data-size]": "size()",
    "[attr.data-disabled]": "disabled() ? '' : null",
  },
})
export class AtralumeContentSwitcher {
  readonly size = input<AtralumeContentSwitcherSize>("m");
  readonly activeItemIndex = model(0);
  readonly disabled = input(false, { transform: booleanAttribute });
}
