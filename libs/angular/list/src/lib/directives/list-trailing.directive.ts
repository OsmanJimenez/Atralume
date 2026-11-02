import { Directive } from "@angular/core";

@Directive({
  selector: "[atrListTrailing]",
  standalone: true,
  host: { class: "atr-list-trailing" },
})
export class AtralumeListTrailing {}
