import { Directive, input, inject } from "@angular/core";
import { TAB_CONTEXT } from "../models/tabs.types";
@Directive({
  selector: "[atrTabPanel]",
  standalone: true,
  host: {
    class: "atr-tab-panel",
    role: "tabpanel",
    "[attr.id]": "id()",
    "[attr.aria-labelledby]": "labelledBy()",
    "[hidden]": "owner.activePanel() !== id()",
    "[attr.tabindex]": "owner.activePanel() === id() ? 0 : -1",
  },
})
export class AtralumeTabPanel {
  readonly id = input.required<string>();
  readonly labelledBy = input.required<string>();
  protected readonly owner = inject(TAB_CONTEXT);
}
