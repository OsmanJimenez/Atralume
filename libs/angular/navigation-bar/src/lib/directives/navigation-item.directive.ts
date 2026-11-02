import { Directive, input, booleanAttribute } from "@angular/core";

@Directive({
  selector: "a[atrNavigationItem]",
  standalone: true,
  host: {
    class: "atr-navigation-item",
    "[attr.aria-current]": 'active() ? "page" : null',
  },
})
export class AtralumeNavigationItem {
  readonly active = input(false, { transform: booleanAttribute });
}
