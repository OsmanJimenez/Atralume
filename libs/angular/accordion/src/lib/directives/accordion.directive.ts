import { Directive } from "@angular/core";

/**
 * Applies Atralume's accordion token scope to Taiga's native accordion host.
 *
 * `TuiAccordionComponent` discovers and pairs its direct child buttons and
 * expands. Keeping this as a directive, rather than wrapping the host in an
 * extra component, preserves that public Taiga contract.
 */
@Directive({
  selector: "tui-accordion[atrAccordion]",
  standalone: true,
  host: { class: "atr-accordion" },
})
export class AtralumeAccordion {}
