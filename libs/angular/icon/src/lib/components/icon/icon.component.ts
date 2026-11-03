import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { TuiIcon } from "@taiga-ui/core";
import { AtralumeIconRegistry } from "../../services/icon-registry";
import type { IconSize } from "../../models/icon.types";

export type AtralumeIconEngine = "registry" | "tui" | "auto";

/**
 * Dual icon host: keeps `atr-icon` + SVG registry, with an optional bridge to Taiga `TuiIcon`.
 * - `engine="registry"` (default): structured SVG paths via `provideAtralumeIcons`.
 * - `engine="tui"`: render `<tui-icon [icon]="name">` (CSS-mask / Taiga icon names).
 * - `engine="auto"`: registry hit → SVG; otherwise treat `name` as a Taiga icon key.
 * Full registry cutover is deferred (high blast radius across badge/button/avatar/playground).
 */
@Component({
  selector: "atr-icon",
  standalone: true,
  imports: [TuiIcon],
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-icon",
    "[attr.data-name]": "name()",
    "[attr.data-size]": "size()",
    "[attr.data-engine]": "resolvedEngine()",
    "[attr.aria-hidden]": 'decorative() ? "true" : null',
    "[attr.role]": 'decorative() ? null : "img"',
    "[attr.aria-label]": "accessibleLabel()",
    "[class.atr-icon--rtl]": "definition()?.mirrorInRtl",
    "[class.atr-icon--tui]": 'resolvedEngine() === "tui"',
    "[style.--atr-icon-custom-size]": "pixelSize()",
  },
})
export class AtralumeIcon {
  readonly name = input.required<string>();
  readonly size = input<IconSize>("medium");
  readonly decorative = input(true, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  /** Optional bridge toward Taiga `TuiIcon` without breaking registry consumers. */
  readonly engine = input<AtralumeIconEngine>("registry");
  private readonly registry = inject(AtralumeIconRegistry);
  protected readonly definition = computed(() => this.registry.get(this.name()));
  protected readonly resolvedEngine = computed<"registry" | "tui">(() => {
    const mode = this.engine();
    if (mode === "tui") return "tui";
    if (mode === "registry") return "registry";
    return this.definition() ? "registry" : "tui";
  });
  protected readonly pixelSize = computed(() => {
    const value = this.size();
    return typeof value === "number" && Number.isFinite(value) && value > 0
      ? `${value}px`
      : null;
  });
  protected readonly accessibleLabel = computed(() => {
    if (this.decorative()) return null;
    const label = this.label()?.trim();
    if (!label) throw new Error("Informative atr-icon requires a label.");
    return label;
  });
}
