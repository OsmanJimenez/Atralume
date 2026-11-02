import { Directive } from "@angular/core";

@Directive({
  selector: "[atrAccordionPanel]",
  standalone: true,
  host: { class: "atr-accordion-panel" },
})
export class AtralumeAccordionPanel {}
