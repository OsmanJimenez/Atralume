# Changelog

All notable public changes to Atralume are documented here. Releases are
generated from reviewed changesets and follow Semantic Versioning.

## 0.2.2 — 2026-11-14

Patch release: export the catalogue search field from the form-field entry.
Catalogue remains **preview**.

### Added

- **`AtralumeSearchField`** (`atr-search-field`) on
  `@osmanjimenez/atralume/form-field` — self-contained search control over
  `tui-textfield` + `atrInput`, with `label`, `placeholder`, `value`, and
  `valueChange`.

## 0.2.1 — 2026-11-14

Patch release: public docs SEO on `atralume.osmanjimenez.dev`, Storybook token
manifest typing fix, and Playground media exploration polish. Catalogue remains
**preview**.

### Added

- Storybook SEO for the canonical host: meta/OG/Twitter, JSON-LD, `robots.txt`,
  `sitemap.xml`, `CNAME`, and `og-image.jpg` (no claims on `osmanjimenez.dev` or
  `fusatour.osmanjimenez.dev`).
- Typed generated module `token-manifest.ts` for Storybook token docs (avoids
  fragile JSON default imports in the Angular Storybook compiler).

### Fixed

- Storybook build failure when resolving
  `styles/generated/token-manifest.json` and the implicit `any` on token-table
  filters.
- Image preview requires a root `<tui-root>`; Playground wraps content accordingly.
- Filter chip labels via Polymorpheus `$implicit` context.

### Changed

- Package homepage and docs links point to `https://atralume.osmanjimenez.dev/`.
- Playground `index.html` uses `noindex` so demos do not compete with docs SEO.

## 0.2.0 — 2026-11-14

Visual craft pass over the Storybook catalogue, a new layout entry, and brand
alignment for overlays and form controls. Catalogue remains **preview**.

### Added

- **`@osmanjimenez/atralume/grid`** — `atr-grid` / `atrGridItem` layout recipe
  with fixed or `auto` columns, tokenized gap, `minTrack`, and span helpers
  (`1`–`4`, `full`). Stories under Composition/Grid; Card Appearances uses the
  grid host.
- Table expanders use `atr-icon` (`chevron-down`) with open-state rotation and a
  compact expander column.
- Card stories: `WithMedia` cover slot and multi-appearance gallery.

### Changed

- **Snackbar** always renders through `atr-snackbar-panel` with brand surface
  tokens (`surface-container-high` / `on-surface`), border, and tighter layout.
  Taiga notification chrome (extra Close, info icon, inverse fill) is
  neutralized when the panel is present.
- **Switch** owns its thumb via `.atr-switch::before`; Taiga `[tuiSwitch]`
  check-icon / shadow-thumb `::after` chrome is disabled so the ghost checkmark
  no longer appears. Control labels stay inline beside the switch.
- **Textarea / textfield focus** uses an inset brand focus ring on the
  `tui-textfield` host (no dark offset “top margin” under the floating label).
- Select / combobox / menu dropdowns no longer clamp to a 24rem max width;
  menus can track the trigger via `--atr-menu-trigger-width`.
- Dialog / overlay Storybook: `scrollbar-gutter: stable` to avoid open-button
  jump when scrollbars appear; dialog Close hit target raised to 48px.
- Side navigation and navigation-bar stories: outlined toggle and `atr-icon`
  leading icons.
- Command palette combobox label set to “Search” to avoid a double “Commands”
  title with the dialog.
- Card elevation token raised to system level-2 for elevated appearance.
- Composition styles document grid item spans outside encapsulation.

### Tokens

- `atr.comp.snackbar.container-color` → `surface-container-high`; label →
  `on-surface`; border → `outline-variant`.
- `atr.comp.grid.gap` → `spacing.md` (`--atr-comp-grid-gap`).

## Unreleased

- **Breaking (pre-release lineage):** Accordion wrappers were replaced by direct
  Taiga host directives. Migrate `<atr-accordion>` / `<atr-accordion-item>` to
  `<tui-accordion atrAccordion>` with direct `button[tuiAccordion]` and
  `tui-expand` children. This restores Taiga's supported pairing, interaction,
  and ARIA behavior.

## 0.1.1

- Package publish / OIDC Trusted Publishing validation bump for
  `@osmanjimenez/atralume`.

## 0.1.0

- First `latest` public preview of the Angular catalogue on npm as
  `@osmanjimenez/atralume`, with Taiga UI 5 peers, token bridge, and Storybook
  Pages deployment.
