import { computed, Directive, input } from "@angular/core";
import { TuiStatus } from "@taiga-ui/kit";

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary";

export type StatusSize = "small" | "medium" | "large";

/**
 * Adapter over Taiga UI `TuiStatus`. Tone paints via CSS when `color` is empty.
 */
@Directive({
  selector: "[atrStatus]",
  standalone: true,
  hostDirectives: [{ directive: TuiStatus, inputs: ["tuiStatus: color"] }],
  host: {
    class: "atr-status",
    "[attr.tuiStatus]": '""',
    "[attr.data-tone]": "tone()",
    "[attr.data-size]": "dataSize()",
  },
})
export class AtralumeStatus {
  readonly tone = input<StatusTone>("neutral");
  /** Raw CSS color for Taiga `--t-status`; empty lets tone CSS apply. */
  readonly color = input("");
  readonly size = input<StatusSize>("medium");

  protected readonly dataSize = computed(() => {
    const map: Record<StatusSize, string> = {
      small: "s",
      medium: "m",
      large: "l",
    };
    return map[this.size()];
  });
}
