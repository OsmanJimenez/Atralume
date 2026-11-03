import { Directive } from "@angular/core";
import { TuiLabel } from "@taiga-ui/core";

/**
 * Layout for a native wrapping or explicitly associated label.
 * Adapter over Taiga UI `TuiLabel`.
 */
@Directive({
  selector: "label[atrControlLabel]",
  standalone: true,
  hostDirectives: [TuiLabel],
  host: {
    class: "atr-control-label",
    "[attr.tuiLabel]": '""',
  },
})
export class AtralumeControlLabel {}
