export type IconSize = "small" | "medium" | "large" | number;

/** Navigable catalog categories for the Icon Explorer and search API. */
export type AtralumeIconCategory =
  | "accessibility"
  | "actions"
  | "arrows"
  | "calendar-time"
  | "commerce"
  | "communication"
  | "custom"
  | "development"
  | "devices"
  | "editing"
  | "files"
  | "finance"
  | "folders"
  | "layout"
  | "maps-location"
  | "media"
  | "navigation"
  | "notifications"
  | "security"
  | "social"
  | "status-feedback"
  | "users";

export type AtralumeIconSource = "atralume" | "taiga" | "custom";

/**
 * Structured path icon registered with `provideAtralumeIcons`.
 * Paths must be SVG path `d` data only — never HTML, URLs, or scripts.
 */
export interface AtralumeIconDefinition {
  readonly name: string;
  readonly paths: readonly string[];
  readonly viewBox?: string;
  readonly mirrorInRtl?: boolean;
  readonly category?: AtralumeIconCategory;
  readonly keywords?: readonly string[];
  readonly aliases?: readonly string[];
}

/** Metadata-only catalog entry (no SVG payload). */
export interface AtralumeIconCatalogEntry {
  readonly name: string;
  /** Stable Taiga CSS-mask name, e.g. `@tui.check`. */
  readonly tuiName: string;
  readonly category: AtralumeIconCategory;
  readonly keywords: readonly string[];
  readonly aliases?: readonly string[];
  readonly filled?: boolean;
  readonly filledName?: string;
  readonly source: AtralumeIconSource;
  readonly mirrorInRtl?: boolean;
}

export interface AtralumeIconSearchOptions {
  readonly query?: string;
  readonly category?: AtralumeIconCategory | "all";
  readonly source?: AtralumeIconSource | "all";
  readonly limit?: number;
}
