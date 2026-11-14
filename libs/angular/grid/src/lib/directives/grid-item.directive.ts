import { Directive, input } from "@angular/core";

export type AtralumeGridSpan = 1 | 2 | 3 | 4 | "full";

/**
 * Optional span marker for children projected into `atr-grid`.
 */
@Directive({
  selector: "[atrGridItem]",
  standalone: true,
  host: {
    class: "atr-grid-item",
    "[attr.data-span]": "span()",
  },
})
export class AtralumeGridItem {
  readonly span = input<AtralumeGridSpan>(1);
}
