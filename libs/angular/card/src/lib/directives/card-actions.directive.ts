import { Directive } from "@angular/core";

@Directive({
  selector: "[atrCardActions]",
  standalone: true,
  host: { class: "atr-card-actions" },
})
export class AtralumeCardActions {}
