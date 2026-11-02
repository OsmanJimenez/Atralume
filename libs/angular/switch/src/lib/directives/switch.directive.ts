import { Directive } from "@angular/core";
@Directive({
  selector: 'input[type="checkbox"][atrSwitch]',
  standalone: true,
  host: { class: "atr-switch", role: "switch" },
})
export class AtralumeSwitch {}
