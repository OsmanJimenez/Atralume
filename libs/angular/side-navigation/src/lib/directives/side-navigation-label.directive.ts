import { Directive } from "@angular/core";

@Directive({
  selector: "[atrSideNavigationLabel]",
  standalone: true,
  host: { class: "atr-side-navigation-label" },
})
export class AtralumeSideNavigationLabel {}
