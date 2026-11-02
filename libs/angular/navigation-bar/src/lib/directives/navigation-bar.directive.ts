import { Directive, input } from "@angular/core";

@Directive({
  selector: "nav[atrNavigationBar]",
  standalone: true,
  host: { class: "atr-navigation-bar", "[attr.aria-label]": "label()" },
})
export class AtralumeNavigationBar {
  readonly label = input("Primary navigation");
}
