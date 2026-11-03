import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from "@angular/core";

/**
 * Legacy selector kept for API stability. Prefer:
 * ```html
 * <tui-accordion [closeOthers]="!multi">
 *   <atr-accordion-item id="…">…</atr-accordion-item>
 * </tui-accordion>
 * ```
 * so `button[tuiAccordion]` can inject `TuiAccordionComponent` (projection
 * through an inner `tui-accordion` breaks DI).
 */
@Component({
  selector: "atr-accordion",
  standalone: true,
  template: `<ng-content />`,
  styleUrl: "./accordion.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-accordion",
    "[attr.data-multi]": "multi()",
    "[attr.data-size]": "size()",
  },
})
export class AtralumeAccordion {
  readonly multi = input(false, { transform: booleanAttribute });
  readonly size = input<"s" | "m" | "l">("m");
}
