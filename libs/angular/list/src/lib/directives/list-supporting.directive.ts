import { Directive } from "@angular/core";

@Directive({
  selector: "[atrListSupporting]",
  standalone: true,
  host: { class: "atr-list-supporting" },
})
export class AtralumeListSupporting {}
