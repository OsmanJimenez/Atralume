import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { TuiItem } from "@taiga-ui/cdk/directives/item";
import { TuiBreadcrumbs } from "@taiga-ui/kit";

/**
 * Thin breadcrumbs over Taiga `tui-breadcrumbs`.
 * Project items with `*tuiItem` (or `[tuiItem]`).
 */
@Component({
  selector: "atr-breadcrumbs, nav[atrBreadcrumbs]",
  standalone: true,
  imports: [TuiBreadcrumbs, TuiItem],
  templateUrl: "./breadcrumbs.component.html",
  styleUrl: "./breadcrumbs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-breadcrumbs",
    "[attr.aria-label]": "label()",
  },
})
export class AtralumeBreadcrumbs {
  readonly label = input("Breadcrumb");
  readonly size = input<"m" | "l">("m");
  readonly itemsLimit = input(4);
}
