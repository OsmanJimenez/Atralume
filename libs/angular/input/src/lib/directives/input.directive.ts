import { Directive, ElementRef, inject, isDevMode } from "@angular/core";
import { TuiInputDirective } from "@taiga-ui/core";

/**
 * Thin adapter: `input[atrInput]` → Taiga `TuiInputDirective` (`tuiInput`).
 *
 * Must sit inside `atr-form-field` / `tui-textfield`. Brand look comes from
 * Taiga + Atralume modes/bridge.
 */
@Directive({
  selector: "input[atrInput]",
  standalone: true,
  hostDirectives: [
    {
      directive: TuiInputDirective,
      inputs: ["readonly", "invalid", "focused", "state"],
    },
  ],
  host: {
    class: "atr-input",
    "[attr.tuiInput]": '""',
  },
})
export class AtralumeInput {
  constructor() {
    const type = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement
      .type;
    if (
      isDevMode() &&
      [
        "checkbox",
        "radio",
        "file",
        "range",
        "color",
        "button",
        "submit",
        "reset",
        "hidden",
        "image",
      ].includes(type)
    ) {
      throw new Error("atrInput requires a text-like native input.");
    }
  }
}
