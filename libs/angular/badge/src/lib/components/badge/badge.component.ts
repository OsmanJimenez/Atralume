import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { TuiBadge } from "@taiga-ui/kit";

export type BadgeTone =
  "neutral" | "primary" | "success" | "warning" | "error" | "info";
export type BadgeAppearance = "filled" | "soft" | "outlined";
export type BadgeSize = "small" | "medium";

/** Adapter over Taiga UI `TuiBadge`; keeps Atralume tones, appearances, and count API. */
@Component({
  selector: "atr-badge",
  standalone: true,
  hostDirectives: [{ directive: TuiBadge, inputs: ["size: tuiSize"] }],
  templateUrl: "./badge.component.html",
  styleUrl: "./badge.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "atr-badge",
    "[attr.tuiBadge]": '""',
    "[attr.data-tone]": "tone()",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-size]": "size()",
    "[class.atr-badge--dot]": "dot()",
    "[attr.aria-label]": "accessibleLabel()",
    "[attr.role]": 'accessibleLabel() ? "img" : null',
  },
})
export class AtralumeBadge {
  readonly tone = input<BadgeTone>("neutral");
  readonly appearance = input<BadgeAppearance>("soft");
  readonly size = input<BadgeSize>("medium");
  readonly count = input<number | null>(null);
  readonly max = input(99);
  readonly dot = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  protected readonly displayCount = computed(() => {
    const count = this.count();
    return count === null
      ? null
      : count > this.max()
        ? `${this.max()}+`
        : String(count);
  });
  protected readonly accessibleLabel = computed(() => {
    if (this.dot() && !this.label()?.trim())
      throw new Error("Dot badges require a label.");
    return (
      this.label() ?? (this.count() === null ? null : String(this.count()))
    );
  });
}
