import { Directive } from "@angular/core";
@Directive({
  selector: 'input[type="radio"][atrRadio]',
  standalone: true,
  host: { class: "atr-radio" },
})
export class AtralumeRadio {}
