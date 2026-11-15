/**
 * Generate Atralume icon catalog metadata from verified @taiga-ui/icons SVGs
 * plus the built-in structured registry icons. Does not embed SVG markup.
 *
 * Usage: node tools/generate-icon-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(root, "node_modules", "@taiga-ui", "icons", "src");
const outFile = path.join(
  root,
  "libs/angular/icon/catalog/src/lib/icon-manifest.generated.ts",
);

/** @typedef {{ id: string, match: RegExp }} CategoryRule */

/** @type {readonly CategoryRule[]} */
const CATEGORY_RULES = [
  {
    id: "accessibility",
    match:
      /^(accessibility|ear|eye|eye-off|glasses|person-standing|wheelchair)/,
  },
  {
    id: "arrows",
    match:
      /^(arrow|chevron|corner|move-|shrink|expand|redo|undo|iterate|reply|forward|backward|between-horizontal|between-vertical|fold|unfold)/,
  },
  {
    id: "navigation",
    match:
      /^(home|menu|panel|sidebar|layout|columns|rows|gallery-horizontal|gallery-vertical|align|gap|separator|split|app-window|panel-)/,
  },
  {
    id: "communication",
    match:
      /^(mail|message|messages|inbox|send|phone|voicemail|megaphone|rss|at-sign|contact|speech|podcast)/,
  },
  {
    id: "files",
    match: /^(file|files|paperclip|clipboard|archive|book|notebook|scroll)/,
  },
  {
    id: "folders",
    match: /^(folder|folders|directory)/,
  },
  {
    id: "media",
    match:
      /^(image|images|camera|video|film|music|audio|mic|volume|play|pause|skip|rewind|fast-forward|clapperboard|picture|gallery|aperture|focus)/,
  },
  {
    id: "devices",
    match:
      /^(monitor|laptop|smartphone|tablet|tv|printer|keyboard|mouse|cpu|hard-drive|server|router|bluetooth|usb|battery|plug|power|radio|speaker|watch|gamepad)/,
  },
  {
    id: "security",
    match:
      /^(lock|unlock|key|shield|fingerprint|scan-face|scan-eye|vault|eye-off|ban|shield-)/,
  },
  {
    id: "users",
    match:
      /^(user|users|person|people|contact|id-card|badge-check|circle-user|book-user)/,
  },
  {
    id: "commerce",
    match:
      /^(shopping|cart|store|bag|tag|tags|ticket|gift|package|barcode|qr-code|receipt)/,
  },
  {
    id: "finance",
    match:
      /^(banknote|wallet|credit-card|coins|piggy|circle-dollar|badge-dollar|hand-coins|landmark|chart-candlestick)/,
  },
  {
    id: "calendar-time",
    match:
      /^(calendar|clock|timer|alarm|hourglass|history|watch|sunrise|sunset|moon|sun)/,
  },
  {
    id: "maps-location",
    match:
      /^(map|globe|compass|navigation|locate|pin|milestone|route|signpost|earth|building|hotel|plane|car|bus|train|bike|ship|anchor|parking)/,
  },
  {
    id: "notifications",
    match: /^(bell|bell-|megaphone|siren|alarm)/,
  },
  {
    id: "status-feedback",
    match:
      /^(check|circle-check|badge-check|x|circle-x|info|circle-alert|triangle-alert|alert|help|circle-help|loader|refresh|rotate|thumbs|heart|star|smile|frown|meh|badge-info|badge-alert|badge-x|badge-plus|badge-minus)/,
  },
  {
    id: "editing",
    match:
      /^(pencil|pen|brush|eraser|scissors|crop|type|bold|italic|underline|strikethrough|list|list-ordered|list-checks|align-|indent|outdent|quote|text|case-|spell|highlighter|paint)/,
  },
  {
    id: "layout",
    match:
      /^(grid|table|rows|columns|square|circle|box|frames|component|blocks|group|ungroup|layers|bring-|send-to|flip|rotate|scaling)/,
  },
  {
    id: "development",
    match:
      /^(code|terminal|bug|git|github|gitlab|braces|brackets|binary|cpu|database|server|webhook|variable|file-code|file-json|package|npm|bot|sparkles|wand)/,
  },
  {
    id: "social",
    match:
      /^(share|link|external-link|rss|podcast|radio|antenna|wifi|signal|cast)/,
  },
  {
    id: "actions",
    match:
      /^(plus|minus|search|filter|settings|sliders|trash|download|upload|save|copy|clipboard|edit|open|close|log-in|log-out|power|play|pause|square|circle-plus|circle-minus|ellipsis|more-|zoom|maximize|minimize|fullscreen|import|export|replace|sweep|hammer|wrench|tool)/,
  },
];

const ATRALUME_BUILTIN = [
  {
    name: "check",
    category: "status-feedback",
    keywords: ["success", "done", "ok"],
    aliases: ["@tui.check"],
    mirrorInRtl: false,
  },
  {
    name: "close",
    category: "actions",
    keywords: ["dismiss", "cancel", "x"],
    aliases: ["@tui.x"],
    mirrorInRtl: false,
  },
  {
    name: "arrow-right",
    category: "arrows",
    keywords: ["next", "forward"],
    aliases: ["@tui.arrow-right"],
    mirrorInRtl: true,
  },
  {
    name: "chevron-down",
    category: "arrows",
    keywords: ["expand", "dropdown"],
    aliases: ["@tui.chevron-down"],
    mirrorInRtl: false,
  },
  {
    name: "info",
    category: "status-feedback",
    keywords: ["information", "help"],
    aliases: ["@tui.info"],
    mirrorInRtl: false,
  },
  {
    name: "warning",
    category: "status-feedback",
    keywords: ["alert", "caution"],
    aliases: ["@tui.triangle-alert"],
    mirrorInRtl: false,
  },
  {
    name: "user",
    category: "users",
    keywords: ["person", "profile", "account"],
    aliases: ["@tui.user"],
    mirrorInRtl: false,
  },
  {
    name: "menu",
    category: "navigation",
    keywords: ["hamburger", "navigation"],
    aliases: ["@tui.menu"],
    mirrorInRtl: false,
  },
];

const RTL_MIRROR =
  /^(arrow-(left|right)|chevron-(left|right)|corner-|log-in|log-out|redo|undo|reply|share|external-link|panel-(left|right)|sidebar)/;

function categorize(baseName) {
  for (const rule of CATEGORY_RULES) {
    if (rule.match.test(baseName)) return rule.id;
  }
  return "custom";
}

function keywordsFromName(baseName) {
  return baseName.split("-").filter(Boolean);
}

function ensureIconsDir() {
  if (!fs.existsSync(iconsDir)) {
    throw new Error(
      `Missing @taiga-ui/icons at ${iconsDir}. Install workspace dependencies first.`,
    );
  }
}

function collectTaigaIcons() {
  const files = fs
    .readdirSync(iconsDir)
    .filter((name) => name.endsWith(".svg") && !name.includes(path.sep));
  /** @type {Map<string, { outline: boolean, filled: boolean }>} */
  const byBase = new Map();
  for (const file of files) {
    const stem = file.replace(/\.svg$/i, "");
    const filled = stem.endsWith("-filled");
    const base = filled ? stem.slice(0, -"-filled".length) : stem;
    if (!base || base.includes("/") || base.includes("\\")) continue;
    const entry = byBase.get(base) ?? { outline: false, filled: false };
    if (filled) entry.filled = true;
    else entry.outline = true;
    byBase.set(base, entry);
  }
  return byBase;
}

function buildEntries(byBase) {
  /** @type {object[]} */
  const entries = [];

  for (const icon of ATRALUME_BUILTIN) {
    entries.push({
      name: icon.name,
      tuiName: `@tui.${icon.name}`,
      category: icon.category,
      keywords: icon.keywords,
      aliases: icon.aliases,
      filled: false,
      source: "atralume",
      mirrorInRtl: icon.mirrorInRtl,
    });
  }

  const sorted = [...byBase.keys()].sort((a, b) => a.localeCompare(b));
  for (const base of sorted) {
    const meta = byBase.get(base);
    if (!meta?.outline && !meta?.filled) continue;
    // Prefer outline as the canonical catalog name; note filled sibling.
    const name = base;
    const category = categorize(base);
    const keywords = keywordsFromName(base);
    const aliases = [`@tui.${base}`];
    if (meta.filled) aliases.push(`@tui.${base}-filled`);
    entries.push({
      name,
      tuiName: `@tui.${base}`,
      category,
      keywords,
      aliases,
      filled: Boolean(meta.filled),
      filledName: meta.filled ? `${base}-filled` : undefined,
      source: "taiga",
      mirrorInRtl: RTL_MIRROR.test(base),
    });
  }

  return entries;
}

function serialize(entries) {
  const categories = [
    ...new Set(entries.map((e) => e.category)),
  ].sort();
  const bySource = entries.reduce((acc, e) => {
    acc[e.source] = (acc[e.source] ?? 0) + 1;
    return acc;
  }, {});
  // Avoid `as const` on the full catalog: a 2k+ literal union freezes tsc/Storybook
  // when stories or consumers import the icon barrel.
  const header = `/* Generated by tools/generate-icon-manifest.mjs — do not edit.
 * Source: @taiga-ui/icons SVG filenames + Atralume built-in registry names.
 * Counts: total=${entries.length} atralume=${bySource.atralume ?? 0} taiga=${bySource.taiga ?? 0}
 */
import type {
  AtralumeIconCatalogEntry,
  AtralumeIconCategory,
} from "@osmanjimenez/atralume/icon";

export const ATRALUME_ICON_CATALOG_VERSION = "0.2.4";

export const ATRALUME_ICON_CATEGORIES: readonly AtralumeIconCategory[] = ${JSON.stringify(categories)};

export const ATRALUME_ICON_CATALOG: readonly AtralumeIconCatalogEntry[] = ${JSON.stringify(entries)};
`;
  return header;
}

function main() {
  ensureIconsDir();
  const byBase = collectTaigaIcons();
  const entries = buildEntries(byBase);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, serialize(entries), "utf8");
  const byCategory = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `Wrote ${entries.length} icon catalog entries → ${path.relative(root, outFile)}`,
  );
  console.log(JSON.stringify(byCategory, null, 2));
}

main();
