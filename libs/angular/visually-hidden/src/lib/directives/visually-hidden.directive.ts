import { booleanAttribute, Directive, input } from "@angular/core";

/**
 * Visually hides content while keeping it available to assistive technology.
 * With `focusable`, content becomes visible on focus (skip-link pattern).
 */
@Directive({
  selector: "[atrVisuallyHidden]",
  standalone: true,
  host: {
    class: "atr-visually-hidden",
    "[class.atr-visually-hidden--focusable]": "focusable()",
  },
})
export class AtralumeVisuallyHidden {
  readonly focusable = input(false, { transform: booleanAttribute });
}
