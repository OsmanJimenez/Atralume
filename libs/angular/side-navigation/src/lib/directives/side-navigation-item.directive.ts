import { Directive, booleanAttribute, input } from "@angular/core";
import { TuiButton } from "@taiga-ui/core";
import { tuiAppearance } from "@taiga-ui/core/directives/appearance";

/**
 * Side-nav item styled with Taiga `TuiButton`.
 * Avoids `TuiAsideItemDirective` (injects `TuiAsideComponent` via hint host),
 * which fails under `ng-content` projection into `aside[tuiNavigationAside]`.
 *
 * Forces `flat` appearance so default TuiButton `primary` does not paint
 * on-accent text (invisible on dark surfaces without a filled background).
 */
@Directive({
  selector: "a[atrSideNavigationItem], button[atrSideNavigationItem]",
  standalone: true,
  hostDirectives: [{ directive: TuiButton, inputs: ["size: tuiSize"] }],
  host: {
    class: "atr-side-navigation-item",
    "[attr.tuiButton]": '""',
    "[attr.aria-current]": 'active() ? "page" : null',
    "[class._active]": "active()",
  },
})
export class AtralumeSideNavigationItem {
  readonly active = input(false, { transform: booleanAttribute });

  /** Keep nav items flat; Atralume CSS owns active container colors. */
  private readonly _tuiAppearance = tuiAppearance("flat");
}
