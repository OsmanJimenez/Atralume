import { Directive } from "@angular/core";

@Directive({
  selector: "details[atrBreadcrumbOverflow]",
  standalone: true,
  host: { class: "atr-breadcrumb-overflow" },
})
export class AtralumeBreadcrumbOverflow {}
