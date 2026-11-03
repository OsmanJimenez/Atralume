import { Directive } from "@angular/core";
import { TuiComboBoxDirective } from "@taiga-ui/kit";

/**
 * Thin adapter: `input[atrComboBox]` → Taiga `TuiComboBoxDirective`.
 *
 * Must sit inside consumer-authored `tui-textfield`. Pair with
 * `<tui-data-list-wrapper *tuiDropdown [items]="…" />`.
 * Forwards Taiga `strict` / `matcher`.
 */
@Directive({
  selector: "input[atrComboBox]",
  standalone: true,
  hostDirectives: [
    {
      directive: TuiComboBoxDirective,
      inputs: ["strict", "matcher"],
    },
  ],
  host: {
    class: "atr-combobox-input",
    "[attr.tuiComboBox]": '""',
  },
})
export class AtralumeComboBoxDirective {}
