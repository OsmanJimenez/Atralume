import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TuiCardLarge } from "@taiga-ui/layout";

/** Adapter over Taiga UI `TuiCardLarge`; keeps Atralume appearances and slots. */
@Component({
  selector: "atr-card",
  standalone: true,
  hostDirectives: [TuiCardLarge],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-card",
    "[attr.tuiCardLarge]": '""',
    "[attr.data-appearance]": "appearance()",
    "[attr.data-atr-surface]": 'appearance() === "glass" ? "glass" : null',
  },
})
export class AtralumeCard {
  readonly appearance = input<"filled" | "elevated" | "outlined" | "glass">(
    "filled",
  );
}
