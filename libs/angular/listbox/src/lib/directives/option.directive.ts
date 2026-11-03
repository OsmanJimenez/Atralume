import { Directive } from "@angular/core";
import { TuiOption } from "@taiga-ui/core";

/**
 * Thin adapter: `button[atrOption]` → Taiga `TuiOption`.
 *
 * Breaking: host must be `button` / `a` / `label`. Bind `[value]` for
 * `TuiOptionWithValue` selection inside `tui-data-list` when needed.
 */
@Directive({
  selector: "button[atrOption], a[atrOption], label[atrOption]",
  standalone: true,
  hostDirectives: [
    {
      directive: TuiOption,
      inputs: ["disabled"],
    },
  ],
  host: {
    class: "atr-option",
    "[attr.tuiOption]": '""',
  },
})
export class AtralumeOptionDirective {}
