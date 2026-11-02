import { Directive } from "@angular/core";

@Directive({
  selector: "[atrSideNavigationContent]",
  standalone: true,
  host: { class: "atr-side-navigation-content" },
})
export class AtralumeSideNavigationContent {}
