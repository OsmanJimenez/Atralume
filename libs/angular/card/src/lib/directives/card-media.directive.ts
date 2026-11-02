import { Directive } from "@angular/core";

@Directive({
  selector: "[atrCardMedia]",
  standalone: true,
  host: { class: "atr-card-media" },
})
export class AtralumeCardMedia {}
