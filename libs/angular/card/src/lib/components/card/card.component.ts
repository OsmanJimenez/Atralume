import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "atr-card",
  standalone: true,
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-card",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-atr-surface]": 'appearance() === "glass" ? "glass" : null',
  },
})
export class AtralumeCard {
  readonly appearance = input<"filled" | "elevated" | "outlined" | "glass">(
    "filled",
  );
}
