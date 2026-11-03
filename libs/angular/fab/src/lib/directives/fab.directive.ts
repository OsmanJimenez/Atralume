import { Directive, input, booleanAttribute } from "@angular/core";
import { TuiButton } from "@taiga-ui/core";

/** Extension over Taiga UI `TuiButton` with Atralume FAB appearances and sizes. */
@Directive({
  selector: "button[atrFab]",
  standalone: true,
  hostDirectives: [{ directive: TuiButton, inputs: ["size: tuiSize"] }],
  host: {
    class: "atr-fab",
    "[attr.tuiButton]": '""',
    "[attr.data-size]": "size()",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-extended]": "extended()",
  },
})
export class AtralumeFab {
  readonly size = input<"small" | "medium" | "large">("medium");
  readonly appearance = input<"primary" | "secondary" | "tertiary" | "surface">(
    "primary",
  );
  readonly extended = input(false, { transform: booleanAttribute });
}
