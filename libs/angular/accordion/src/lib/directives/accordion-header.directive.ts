import { Directive } from "@angular/core";

@Directive({
  selector: "button[tuiAccordion][atrAccordionHeader]",
  standalone: true,
  host: { class: "atr-accordion-header" },
})
export class AtralumeAccordionHeader {}
