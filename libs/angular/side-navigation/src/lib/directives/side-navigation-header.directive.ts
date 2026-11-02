import { Directive } from "@angular/core";

@Directive({
  selector: "[atrSideNavigationHeader]",
  standalone: true,
  host: { class: "atr-side-navigation-header" },
})
export class AtralumeSideNavigationHeader {}
