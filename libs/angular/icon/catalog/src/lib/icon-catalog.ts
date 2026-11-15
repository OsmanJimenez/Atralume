import type {
  AtralumeIconCatalogEntry,
  AtralumeIconCategory,
  AtralumeIconSearchOptions,
  AtralumeIconSource,
} from "@osmanjimenez/atralume/icon";
import {
  ATRALUME_ICON_CATALOG,
  ATRALUME_ICON_CATEGORIES,
  ATRALUME_ICON_CATALOG_VERSION,
} from "./icon-manifest.generated";

export {
  ATRALUME_ICON_CATALOG,
  ATRALUME_ICON_CATEGORIES,
  ATRALUME_ICON_CATALOG_VERSION,
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/^@tui\./, "");
}

function matchesQuery(entry: AtralumeIconCatalogEntry, query: string): boolean {
  if (!query) return true;
  const haystack = [
    entry.name,
    entry.tuiName,
    entry.category,
    ...(entry.aliases ?? []),
    ...entry.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

/** Resolve a friendly or `@tui.*` name to the Taiga mask token. */
export function toTuiIconName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("@tui.") || trimmed.startsWith("@img.") || trimmed.startsWith("@font.")) {
    return trimmed;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  return `@tui.${normalize(trimmed)}`;
}

/** Look up a single catalog entry by name or alias. */
export function getAtralumeIconCatalogEntry(
  name: string,
): AtralumeIconCatalogEntry | undefined {
  const key = normalize(name);
  return ATRALUME_ICON_CATALOG.find(
    (entry) =>
      entry.name === key ||
      normalize(entry.tuiName) === key ||
      entry.aliases?.some((alias) => normalize(alias) === key),
  );
}

export function listAtralumeIconCategories(): readonly AtralumeIconCategory[] {
  return ATRALUME_ICON_CATEGORIES;
}

export function countAtralumeIcons(options: {
  category?: AtralumeIconCategory | "all";
  source?: AtralumeIconSource | "all";
} = {}): number {
  return searchAtralumeIcons({ ...options, query: "", limit: Number.POSITIVE_INFINITY })
    .length;
}

/**
 * Case-insensitive catalog search over name, alias, category, and keywords.
 * The catalog is metadata-only — rendering still goes through `atr-icon`
 * (`engine="tui"` / `"auto"`) or the structured registry.
 */
export function searchAtralumeIcons(
  options: AtralumeIconSearchOptions = {},
): readonly AtralumeIconCatalogEntry[] {
  const query = normalize(options.query ?? "");
  const category = options.category ?? "all";
  const source = options.source ?? "all";
  const limit =
    typeof options.limit === "number" && options.limit > 0
      ? options.limit
      : Number.POSITIVE_INFINITY;

  const results: AtralumeIconCatalogEntry[] = [];
  for (const entry of ATRALUME_ICON_CATALOG) {
    if (category !== "all" && entry.category !== category) continue;
    if (source !== "all" && entry.source !== source) continue;
    if (!matchesQuery(entry, query)) continue;
    results.push(entry);
    if (results.length >= limit) break;
  }
  return results;
}
