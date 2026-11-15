import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { AtralumeIconRegistry } from "../../services/icon-registry";
import type { IconSize } from "../../models/icon.types";

export type AtralumeIconEngine = "registry" | "tui" | "auto";

/**
 * Dual icon host: keeps `atr-icon` + SVG registry, with an optional bridge to Taiga Lucide assets.
 * - `engine="registry"` (default): structured SVG paths via `provideAtralumeIcons`.
 * - `engine="tui"`: CSS-mask glyph from `/assets/taiga-ui/icons/{name}.svg`.
 * - `engine="auto"`: registry hit → SVG; otherwise treat `name` as a Taiga icon key.
 * Full registry cutover is deferred (high blast radius across badge/button/avatar/playground).
 */
@Component({
  selector: "atr-icon",
  standalone: true,
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
  protected readonly definition = computed(() => {
    if (this.engine() === "tui") return undefined;
    // tryGet avoids DevMode throws so engine="auto" can fall back to TuiIcon.
    if (this.engine() === "auto") return this.registry.tryGet(this.name());
    return this.registry.get(this.name());
  });
  protected readonly resolvedEngine = computed<"registry" | "tui">(() => {
    const mode = this.engine();
    if (mode === "tui") return "tui";
    if (mode === "registry") return "registry";
    return this.definition() ? "registry" : "tui";
  });
  /** Public Taiga token (`@tui.heart`) for docs / snippets. */
  protected readonly tuiIconName = computed(() => {
    const raw = this.name();
    if (raw.startsWith("@tui.")) return raw;
    if (raw.startsWith("@") || raw.includes("/") || raw.startsWith("http")) {
      return raw;
    }
    return `@tui.${raw.replace(/^@tui\./, "")}`;
  });

  /** CSS `mask-image` url for Lucide assets under Storybook / app static dirs. */
  protected readonly tuiMaskUrl = computed(() => {
    const token = this.tuiIconName();
    if (token.startsWith("http") || token.includes("/")) {
      return `url("${token}")`;
    }
    const file = token.replace(/^@tui\./, "");
    return `url("/assets/taiga-ui/icons/${file}.svg")`;
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
