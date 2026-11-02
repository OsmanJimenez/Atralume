import { Directive, input, booleanAttribute } from "@angular/core";

@Directive({
  selector: "a[atrSideNavigationItem]",
  standalone: true,
  host: {
    class: "atr-side-navigation-item",
    "[attr.aria-current]": 'active() ? "page" : null',
  },
})
export class AtralumeSideNavigationItem {
  readonly active = input(false, { transform: booleanAttribute });
}
