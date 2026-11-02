import { Directive, input, booleanAttribute } from "@angular/core";

@Directive({
  selector: "a[atrBreadcrumbItem], span[atrBreadcrumbItem]",
  standalone: true,
  host: {
    class: "atr-breadcrumb-item",
    "[attr.aria-current]": 'current() ? "page" : null',
  },
})
export class AtralumeBreadcrumbItem {
  readonly current = input(false, { transform: booleanAttribute });
}
