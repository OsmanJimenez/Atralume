import { Directive } from "@angular/core";

/**
 * Marks a Taiga accordion trigger as an Atralume accordion item.
 *
 * The native button retains Taiga's public `tuiAccordion` behavior, including
 * keyboard activation, `aria-expanded`, and `aria-controls`.
 */
@Directive({
  selector: "button[tuiAccordion][atrAccordionItem]",
  standalone: true,
  host: { class: "atr-accordion-item" },
})
export class AtralumeAccordionItem {}
