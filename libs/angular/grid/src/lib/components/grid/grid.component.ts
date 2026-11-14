import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

export type AtralumeGridColumns = number | "auto";
export type AtralumeGridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const GAP_TOKEN: Record<AtralumeGridGap, string> = {
  none: "0",
  xs: "var(--atr-sys-spacing-xs)",
  sm: "var(--atr-sys-spacing-sm)",
  md: "var(--atr-sys-spacing-md)",
  lg: "var(--atr-sys-spacing-lg)",
  xl: "var(--atr-sys-spacing-xl)",
};

/**
 * Lightweight CSS grid layout host. No Taiga grid primitive; columns/gap are
 * tokenized via `--atr-comp-grid-*` with a min-track floor for auto-fill.
 */
@Component({
  selector: "atr-grid",
  standalone: true,
  template: "<ng-content />",
  styleUrl: "./grid.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-grid",
    "[attr.data-columns]": "columnsAttr()",
    "[attr.data-gap]": "gap()",
    "[style.--atr-grid-columns]": "columnsCss()",
    "[style.--atr-grid-gap]": "gapCss()",
    "[style.--atr-grid-min]": "minTrack()",
  },
})
export class AtralumeGrid {
  /** Fixed column count, or `"auto"` for auto-fill by `minTrack`. */
  readonly columns = input<AtralumeGridColumns>(3);
  readonly gap = input<AtralumeGridGap>("md");
  /** Minimum track size when `columns="auto"` (CSS length). */
  readonly minTrack = input("14rem");

  protected readonly columnsAttr = computed(() => String(this.columns()));
  protected readonly columnsCss = computed(() => {
    const columns = this.columns();
    if (columns === "auto") return "auto";
    const n = Math.trunc(Number(columns));
    return String(Number.isFinite(n) && n > 0 ? n : 3);
  });
  protected readonly gapCss = computed(
    () => GAP_TOKEN[this.gap()] ?? GAP_TOKEN.md,
  );
}
