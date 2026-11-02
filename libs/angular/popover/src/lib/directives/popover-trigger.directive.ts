import { Directive, input } from "@angular/core";
import type { AtralumePopover } from "../components/popover/popover.component";
@Directive({
  selector: "button[atrPopoverTriggerFor]",
  standalone: true,
  host: {
    "[attr.aria-expanded]": "atrPopoverTriggerFor().opened()",
    "[attr.aria-controls]":
      "atrPopoverTriggerFor().opened()?atrPopoverTriggerFor().panelId():null",
    "[attr.aria-haspopup]":
      'atrPopoverTriggerFor().panelRole() === "dialog" ? "dialog" : null',
    "(click)": "atrPopoverTriggerFor().toggle()",
  },
})
export class AtralumePopoverTrigger {
  readonly atrPopoverTriggerFor = input.required<AtralumePopover>();
}
