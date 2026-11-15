import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from "@angular/core";
import { type TuiSizeS } from "@taiga-ui/core";
import { TuiActionBar } from "@taiga-ui/kit";

export type AtralumeActionBarSize = TuiSizeS;

/**
 * Thin adapter over Taiga UI `TuiActionBar` for multi-select / bulk action toolbars.
 * Project status text and action buttons; pair with a popup host when floating.
 */
@Component({
  selector: "atr-action-bar",
  standalone: true,
  imports: [TuiActionBar],
  templateUrl: "./action-bar.component.html",
  styleUrl: "./action-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-action-bar",
    "[attr.data-size]": "size()",
    "[attr.data-expanded]": "expanded() ? '' : null",
  },
})
export class AtralumeActionBar {
  /** Expands overflow / mobile action chrome when true. */
  readonly expanded = input(false, { transform: booleanAttribute });
  readonly size = input<AtralumeActionBarSize>("m");
}
