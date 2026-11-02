import { Directive } from "@angular/core";

@Directive({
  selector: "[atrAccordionHeader]",
  standalone: true,
  host: { class: "atr-accordion-header" },
})
export class AtralumeAccordionHeader {}
