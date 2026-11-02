import { booleanAttribute, Directive, input } from "@angular/core";
export type DividerOrientation = "horizontal" | "vertical";
export type DividerInset = "none" | "start" | "end" | "both";
@Directive({
  selector: "[atrDivider]",
  standalone: true,
  host: {
    class: "atr-divider",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-inset]": "inset()",
    "[attr.role]": 'decorative() ? "presentation" : "separator"',
    "[attr.aria-orientation]": "decorative() ? null : orientation()",
    "[attr.aria-hidden]": 'decorative() ? "true" : null',
  },
})
export class AtralumeDivider {
  readonly orientation = input<DividerOrientation>("horizontal");
  readonly inset = input<DividerInset>("none");
  readonly decorative = input(false, { transform: booleanAttribute });
}
