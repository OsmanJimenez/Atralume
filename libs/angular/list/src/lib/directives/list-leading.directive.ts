import { Directive } from "@angular/core";

@Directive({
  selector: "[atrListLeading]",
  standalone: true,
  host: { class: "atr-list-leading" },
})
export class AtralumeListLeading {}
