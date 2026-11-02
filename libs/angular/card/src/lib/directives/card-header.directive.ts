import { Directive } from "@angular/core";

@Directive({
  selector: "[atrCardHeader]",
  standalone: true,
  host: { class: "atr-card-header" },
})
export class AtralumeCardHeader {}
