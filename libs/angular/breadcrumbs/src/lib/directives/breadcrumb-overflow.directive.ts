import { Directive } from "@angular/core";

/** @deprecated Overflow is owned by Taiga `itemsLimit`. No-op host. */
@Directive({
  selector: "[atrBreadcrumbOverflow]",
  standalone: true,
  host: { class: "atr-breadcrumb-overflow", hidden: "true" },
})
export class AtralumeBreadcrumbOverflow {}
