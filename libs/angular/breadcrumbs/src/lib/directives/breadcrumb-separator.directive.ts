import { Directive } from "@angular/core";

/** @deprecated Separators are owned by Taiga `tui-breadcrumbs`. No-op host. */
@Directive({
  selector: "[atrBreadcrumbSeparator]",
  standalone: true,
  host: { class: "atr-breadcrumb-separator", hidden: "true" },
})
export class AtralumeBreadcrumbSeparator {}
