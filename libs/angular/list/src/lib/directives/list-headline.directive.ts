import { Directive } from "@angular/core";

@Directive({
  selector: "[atrListHeadline]",
  standalone: true,
  host: { class: "atr-list-headline" },
})
export class AtralumeListHeadline {}
