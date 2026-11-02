import { AtomsDemo } from "./atoms-demo.component";
import { DashboardDemo } from "./dashboard-demo.component";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AtralumeButton } from "@atralume/angular/button";

@Component({
  imports: [AtralumeButton, DashboardDemo, AtomsDemo],
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
