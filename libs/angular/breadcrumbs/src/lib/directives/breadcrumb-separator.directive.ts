import { Directive } from "@angular/core";

@Directive({
  selector: "[atrBreadcrumbSeparator]",
  standalone: true,
  host: { class: "atr-breadcrumb-separator", "aria-hidden": "true" },
})
export class AtralumeBreadcrumbSeparator {}
