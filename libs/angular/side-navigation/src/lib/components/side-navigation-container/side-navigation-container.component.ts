import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TuiMainComponent } from "@taiga-ui/layout";

/**
 * Layout host for side navigation; projects Taiga aside + `main[tuiNavigationMain]`.
 */
@Component({
  selector: "atr-side-navigation-container",
  standalone: true,
  imports: [TuiMainComponent],
  templateUrl: "./side-navigation-container.component.html",
  styleUrl: "./side-navigation-container.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-side-navigation-container" },
})
export class AtralumeSideNavigationContainer {}
