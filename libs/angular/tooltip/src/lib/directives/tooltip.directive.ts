import { Directive, booleanAttribute, input } from "@angular/core";
import { TuiHintDirective } from "@taiga-ui/core";

export type TooltipPosition = "above" | "below" | "before" | "after";

/**
 * Adapter over Taiga UI `TuiHintDirective`.
 * Forwards tooltip text and delays through `hostDirectives` input aliases.
 */
@Directive({
  selector: "[atrTooltip]",
  standalone: true,
  exportAs: "atrTooltip",
  hostDirectives: [
    {
      directive: TuiHintDirective,
      // Delays live on nested `TuiHintHover`; not re-exportable here.
      inputs: ["tuiHint: atrTooltip"],
    },
  ],
  host: {
    class: "atr-tooltip-trigger",
  },
})
export class AtralumeTooltip {
  readonly atrTooltip = input.required<string>();
  /** Retained for a11y consumers; Taiga hint manages description ids. */
  readonly tooltipId = input.required<string>();
  /** Kept for API stability; Taiga hint direction defaults apply. */
  readonly position = input<TooltipPosition>("above");
  readonly showDelay = input(500);
  readonly hideDelay = input(150);
  /** When true, pass an empty `atrTooltip` to suppress the hint. */
  readonly tooltipDisabled = input(false, { transform: booleanAttribute });
}
