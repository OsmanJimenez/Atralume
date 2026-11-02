import { Directive, input } from "@angular/core";

@Directive({
  selector: "nav[atrBreadcrumbs]",
  standalone: true,
  host: { class: "atr-breadcrumbs", "[attr.aria-label]": "label()" },
})
export class AtralumeBreadcrumbs {
  readonly label = input("Breadcrumb");
}
