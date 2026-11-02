import { Directive } from "@angular/core";

@Directive({
  selector: "[atrSideNavigationGroup]",
  standalone: true,
  host: { class: "atr-side-navigation-group" },
})
export class AtralumeSideNavigationGroup {}
