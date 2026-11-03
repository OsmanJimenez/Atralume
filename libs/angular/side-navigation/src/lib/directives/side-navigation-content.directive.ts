import { Directive } from "@angular/core";

/**
 * Marks projected main content inside `atr-side-navigation-container`.
 * Breaking: host no longer needs `main[atrSideNavigationContent]`; container wraps content in `main[tuiNavigationMain]`.
 * Kept as a no-op marker for existing templates.
 */
@Directive({
  selector: "[atrSideNavigationContent]",
  standalone: true,
  host: { class: "atr-side-navigation-content" },
})
export class AtralumeSideNavigationContent {}
