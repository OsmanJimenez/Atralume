import { Directive } from "@angular/core";
import { TuiSelectDirective } from "@taiga-ui/kit";

/**
 * Thin adapter: `input[atrSelect]` → Taiga `TuiSelectDirective` (`tuiSelect`).
 *
 * Must sit inside consumer-authored `tui-textfield`. Pair with
 * `<tui-data-list-wrapper *tuiDropdown [items]="…" />`.
 */
@Directive({
  selector: "input[atrSelect]",
  standalone: true,
  hostDirectives: [TuiSelectDirective],
  host: {
    class: "atr-select-input",
    "[attr.tuiSelect]": '""',
  },
})
export class AtralumeSelectDirective {}
