import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TuiSkeleton } from "@taiga-ui/kit";

/**
 * Adapter over Taiga UI `TuiSkeleton`.
 * Keeps `atr-skeleton` with appearance/animation tokens.
 */
@Component({
  selector: "atr-skeleton",
  standalone: true,
  templateUrl: "./skeleton.component.html",
  styleUrl: "./skeleton.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TuiSkeleton,
      inputs: ["tuiSkeleton: active"],
    },
  ],
  host: {
    class: "atr-skeleton",
    "aria-hidden": "true",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-animation]": "animation()",
  },
})
export class AtralumeSkeleton {
  /** Forwards to Taiga `tuiSkeleton`; dedicated placeholder is always active. */
  readonly active = input(true);
  readonly appearance = input<"text" | "circle" | "rectangle" | "rounded">(
    "text",
  );
  readonly animation = input<"pulse" | "shimmer" | "none">("pulse");
}
