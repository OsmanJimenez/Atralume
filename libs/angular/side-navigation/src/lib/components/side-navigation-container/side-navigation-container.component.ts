import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "atr-side-navigation-container",
  standalone: true,
  templateUrl: "./side-navigation-container.component.html",
  styleUrl: "./side-navigation-container.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-side-navigation-container" },
})
export class AtralumeSideNavigationContainer {}
