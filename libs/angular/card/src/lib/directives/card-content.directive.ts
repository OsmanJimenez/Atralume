import { Directive } from "@angular/core";

@Directive({
  selector: "[atrCardContent]",
  standalone: true,
  host: { class: "atr-card-content" },
})
export class AtralumeCardContent {}
