import { Directive } from "@angular/core";
/** Layout for a native wrapping or explicitly associated label. */
@Directive({
  selector: "label[atrControlLabel]",
  standalone: true,
  host: { class: "atr-control-label" },
})
export class AtralumeControlLabel {}
