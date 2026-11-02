import { Directive, input } from "@angular/core";

@Directive({
  selector: "ul[atrList], ol[atrList]",
  standalone: true,
  host: { class: "atr-list", "[attr.data-density]": "density()" },
})
export class AtralumeList {
  readonly density = input<"comfortable" | "compact">("comfortable");
}
