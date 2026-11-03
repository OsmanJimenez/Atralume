import { Directive, input } from "@angular/core";
import { TuiTextareaComponent } from "@taiga-ui/kit";

export type AtralumeTextareaResize =
  | "none"
  | "vertical"
  | "horizontal"
  | "both";

/**
 * Thin adapter: `textarea[atrTextarea]` → Taiga `TuiTextareaComponent`.
 *
 * Must sit inside `atr-form-field` / `tui-textfield`. Optional `resize` remains
 * an Atralume affordance on top of Taiga row behavior.
 */
@Directive({
  selector: "textarea[atrTextarea]",
  standalone: true,
  hostDirectives: [
    {
      directive: TuiTextareaComponent,
      inputs: ["minRows", "maxRows", "content"],
    },
  ],
  host: {
    class: "atr-textarea",
    "[attr.tuiTextarea]": '""',
    "[style.resize]": "resize()",
  },
})
export class AtralumeTextarea {
  readonly resize = input<AtralumeTextareaResize>("vertical");
}
