import { AtomsDemo } from "./atoms-demo.component";
import { DashboardDemo } from "./dashboard-demo.component";
import { ExplorationDemo } from "./exploration-demo.component";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeCard } from "@osmanjimenez/atralume/card";
import { AtralumeLink } from "@osmanjimenez/atralume/link";
import { TuiRoot } from "@taiga-ui/core";

@Component({
  imports: [
    AtralumeButton,
    AtralumeCard,
    AtralumeLink,
    DashboardDemo,
    AtomsDemo,
    ExplorationDemo,
    TuiRoot,
  ],
  selector: "atr-root",
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = signal<"light" | "dark">("light");

  protected toggleTheme(): void {
    this.theme.update((current) => (current === "light" ? "dark" : "light"));
  }
}
