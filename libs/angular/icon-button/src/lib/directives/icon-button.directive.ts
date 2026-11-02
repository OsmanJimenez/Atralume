import { Directive, input } from "@angular/core";
export type IconButtonAppearance = "standard" | "filled" | "tonal" | "outlined";
export type IconButtonSize = "small" | "medium" | "large";
@Directive({
  selector: "button[atrIconButton]",
  standalone: true,
  host: {
    class: "atr-icon-button",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-size]": "size()",
  },
})
export class AtralumeIconButton {
  readonly appearance = input<IconButtonAppearance>("standard");
  readonly size = input<IconButtonSize>("medium");
}
