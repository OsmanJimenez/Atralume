import { Directive } from "@angular/core";

@Directive({
  selector: "[atrListMetadata]",
  standalone: true,
  host: { class: "atr-list-metadata" },
})
export class AtralumeListMetadata {}
