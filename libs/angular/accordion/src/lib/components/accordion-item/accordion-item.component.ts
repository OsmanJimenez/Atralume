import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
} from "@angular/core";
import { TuiAccordion } from "@taiga-ui/kit";

/**
 * Accordion item over Taiga `button[tuiAccordion]` + `tui-expand`.
 * Header: `[atrAccordionHeader]`; body: remaining content / `[atrAccordionPanel]`.
 */
@Component({
  selector: "atr-accordion-item",
  standalone: true,
  imports: [TuiAccordion],
  templateUrl: "./accordion-item.component.html",
  styleUrl: "./accordion-item.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-accordion-item",
    "[attr.data-id]": "id()",
    "[attr.data-expanded]": "expanded()",
  },
})
export class AtralumeAccordionItem {
  readonly id = input.required<string>();
  readonly expanded = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
}
