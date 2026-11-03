import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
} from "@angular/core";
import { TuiAsideComponent } from "@taiga-ui/layout";

export type SideNavigationMode = "side" | "over" | "push";

/**
 * Composes Taiga `aside[tuiNavigationAside]`.
 * Breaking: custom overlay engine for `mode="over"` removed; open/close is show/hide.
 * `collapsed` maps to Taiga `expanded` inverted (`!collapsed`).
 */
@Component({
  selector: "atr-side-navigation",
  standalone: true,
  imports: [TuiAsideComponent],
  templateUrl: "./side-navigation.component.html",
  styleUrl: "./side-navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-side-navigation",
    "[attr.data-mode]": "mode()",
    "[attr.data-opened]": "opened()",
    "[attr.data-collapsed]": "collapsed()",
  },
})
export class AtralumeSideNavigation {
  readonly panelId = input.required<string>();
  readonly label = input.required<string>();
  /** Kept for API compatibility; `over` no longer portals via overlay. */
  readonly mode = input<SideNavigationMode>("side");
  readonly opened = model(true);
  readonly collapsed = input(false, { transform: booleanAttribute });
  /** @deprecated Unused after overlay removal. */
  readonly origin = input<HTMLElement | null>(null);

  protected readonly expanded = computed(() => !this.collapsed());
}
