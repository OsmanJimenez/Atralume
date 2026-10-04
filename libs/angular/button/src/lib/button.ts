import { Directive } from "@angular/core";

/** A semantic, token-driven filled button. */
@Directive({
  selector: "button[atrButton]",
  standalone: true,
  host: {
    class: "atr-button",
  },
})
export class AtralumeButton {}
