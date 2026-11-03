import { Directive, input } from "@angular/core";
import { TuiButton } from "@taiga-ui/core";

export type IconButtonAppearance = "standard" | "filled" | "tonal" | "outlined";
export type IconButtonSize = "small" | "medium" | "large";

/** Adapter over Taiga UI `TuiButton` (icon-button host); keeps Atralume API. */
@Directive({
  selector: "button[atrIconButton]",
  standalone: true,
  hostDirectives: [{ directive: TuiButton, inputs: ["size: tuiSize"] }],
  host: {
    class: "atr-icon-button",
    "[attr.tuiIconButton]": '""',
    "[attr.data-appearance]": "appearance()",
    "[attr.data-size]": "size()",
  },
})
export class AtralumeIconButton {
  readonly appearance = input<IconButtonAppearance>("standard");
  readonly size = input<IconButtonSize>("medium");
}
