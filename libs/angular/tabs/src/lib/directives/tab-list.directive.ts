import {
  Directive,
  booleanAttribute,
  effect,
  inject,
  input,
  untracked,
} from "@angular/core";
import { TuiTabsDirective, TuiTabsHorizontal } from "@taiga-ui/kit";
import { TAB_CONTEXT } from "../models/tabs.types";

/**
 * Deepens the tab list shell onto Taiga `tui-tabs` (`TuiTabsHorizontal` → `TuiTabs`).
 * Breaking: host must be `<tui-tabs atrTabList>` (no plain `div[atrTabList]`).
 * Vertical: set `[vertical]` / `data-vertical` on the same `tui-tabs` when needed.
 */
@Directive({
  selector: "tui-tabs[atrTabList]",
  standalone: true,
  hostDirectives: [
    {
      directive: TuiTabsHorizontal,
      inputs: ["underline"],
    },
  ],
  host: {
    class: "atr-tab-list",
    role: "tablist",
    "[attr.aria-label]": "owner.label()",
    "[attr.aria-orientation]": "owner.orientation()",
    "[attr.vertical]": 'owner.orientation() === "vertical" ? "" : null',
    "[attr.data-vertical]":
      'owner.orientation() === "vertical" ? "start" : null',
  },
})
export class AtralumeTabList {
  readonly underline = input(true, { transform: booleanAttribute });
  protected readonly owner = inject(TAB_CONTEXT);
  private readonly tabs = inject(TuiTabsDirective, { self: true, optional: true });

  constructor() {
    effect(() => {
      const activeId = this.owner.activeId();
      const dir = this.tabs;
      if (!dir) return;
      untracked(() => {
        const index = dir.tabs.findIndex((el) => el.id === activeId);
        if (index >= 0 && dir.activeItemIndex() !== index) {
          dir.activeItemIndex.set(index);
        }
      });
    });
  }
}
