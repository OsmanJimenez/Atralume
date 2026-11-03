import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TuiNavComponent } from "@taiga-ui/layout";

/**
 * Thin host over Taiga `nav[tuiNavigationNav]` (`TuiNavigation`).
 * Breaking: `nav[atrNavigationBar]` → `<atr-navigation-bar>`.
 */
@Component({
  selector: "atr-navigation-bar",
  standalone: true,
  imports: [TuiNavComponent],
  templateUrl: "./navigation-bar.component.html",
  styleUrl: "./navigation-bar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-navigation-bar" },
})
export class AtralumeNavigationBar {
  readonly label = input("Primary navigation");
}
