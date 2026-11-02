import { Directive } from "@angular/core";

@Directive({
  selector: "[atrMenuSeparator]",
  standalone: true,
  host: { class: "atr-menu-separator", role: "separator" },
})
export class AtralumeMenuSeparator {}
