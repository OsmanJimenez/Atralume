import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TuiBlockStatus } from "@taiga-ui/layout";

export type AtralumeEmptyStateAppearance = "standard" | "compact";

/** Generic absence-of-content status, composed from Taiga's accessible block status. */
@Component({
  selector: "atr-empty-state",
  standalone: true,
  imports: [TuiBlockStatus],
  templateUrl: "./empty-state.component.html",
  styleUrl: "./empty-state.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-empty-state", "[attr.data-appearance]": "appearance()" },
})
export class AtralumeEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly appearance = input<AtralumeEmptyStateAppearance>("standard");
}
