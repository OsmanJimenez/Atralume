import { Directive, input, booleanAttribute } from "@angular/core";

@Directive({
  selector: "li[atrListItem], a[atrListItem], button[atrListItem]",
  standalone: true,
  host: { class: "atr-list-item", "[attr.data-selected]": "selected()" },
})
export class AtralumeListItem {
  readonly selected = input(false, { transform: booleanAttribute });
}
