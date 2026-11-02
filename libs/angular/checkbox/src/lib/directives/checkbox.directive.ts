import { Directive, booleanAttribute, input } from "@angular/core";
@Directive({
  selector: 'input[type="checkbox"][atrCheckbox]',
  standalone: true,
  host: { class: "atr-checkbox", "[indeterminate]": "indeterminate()" },
})
export class AtralumeCheckbox {
  readonly indeterminate = input(false, { transform: booleanAttribute });
}
