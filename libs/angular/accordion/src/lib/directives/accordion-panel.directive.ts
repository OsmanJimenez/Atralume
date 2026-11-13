import { Directive } from "@angular/core";

@Directive({
  selector: "tui-expand[atrAccordionPanel]",
  standalone: true,
  host: { class: "atr-accordion-panel" },
})
export class AtralumeAccordionPanel {}
