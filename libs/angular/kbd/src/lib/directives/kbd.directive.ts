import { Directive, input } from "@angular/core";

export type KbdSize = "small" | "medium";

/**
 * Brands a native `kbd` element for shortcut hints with `--atr-comp-kbd-*` tokens.
 */
@Directive({
  selector: "kbd[atrKbd]",
  standalone: true,
  host: {
    class: "atr-kbd",
    "[attr.data-size]": "size()",
  },
})
export class AtralumeKbd {
  readonly size = input<KbdSize>("medium");
}
