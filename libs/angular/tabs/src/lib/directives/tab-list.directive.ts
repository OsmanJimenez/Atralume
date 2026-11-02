import { Directive, inject } from "@angular/core";
import { TAB_CONTEXT } from "../models/tabs.types";
@Directive({
  selector: "[atrTabList]",
  standalone: true,
  host: {
    class: "atr-tab-list",
    role: "tablist",
    "[attr.aria-label]": "owner.label()",
    "[attr.aria-orientation]": "owner.orientation()",
  },
})
export class AtralumeTabList {
  protected readonly owner = inject(TAB_CONTEXT);
}
