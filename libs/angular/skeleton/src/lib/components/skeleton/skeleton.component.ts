import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "atr-skeleton",
  standalone: true,
  templateUrl: "./skeleton.component.html",
  styleUrl: "./skeleton.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-skeleton",
    "aria-hidden": "true",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-animation]": "animation()",
  },
})
export class AtralumeSkeleton {
  readonly appearance = input<"text" | "circle" | "rectangle" | "rounded">(
    "text",
  );
  readonly animation = input<"pulse" | "shimmer" | "none">("pulse");
}
