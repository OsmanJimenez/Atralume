import { Directive } from "@angular/core";
import { TuiItem } from "@taiga-ui/cdk/directives/item";

/**
 * Item marker for `atr-breadcrumbs` / `tui-breadcrumbs`.
 * Prefer `*tuiItem` in new templates; this keeps the `atrBreadcrumbItem` selector.
 */
@Directive({
  selector: "[atrBreadcrumbItem]",
  standalone: true,
  hostDirectives: [TuiItem],
  host: { class: "atr-breadcrumb-item" },
})
export class AtralumeBreadcrumbItem {}
