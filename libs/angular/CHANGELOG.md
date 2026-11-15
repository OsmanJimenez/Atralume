# Changelog

Canonical release notes live in the repository root
[`CHANGELOG.md`](https://github.com/OsmanJimenez/Atralume/blob/master/CHANGELOG.md).

## 0.2.4 — 2026-11-15

- Full Icon Explorer rendering (~2,191) with normalized Taiga masks and copyable `@tui.*` codes.
- Image 360: gyro, inertia, pinch zoom, light stereo VR; immersive chrome.
- Stepper progress caption; Tabs/Card/File Upload chrome and playground UX polish.

## 0.2.3 — 2026-11-15

- Icon catalog manifest + Icon Explorer; registry `tryGet` / aliases / search API.
- Catalog ships as secondary entry `@osmanjimenez/atralume/icon/catalog` so the default `icon` entry and Storybook stories stay light.
- New entrypoints: `timeline`, `content-switcher`, `action-bar`.
- Pattern recipes: quantity selector, shortcut hint, destructive confirm.

## 0.2.1 — 2026-11-14

- SEO for `https://atralume.osmanjimenez.dev/` (canonical, sitemap, robots, OG).
- Typed `token-manifest.ts` for Storybook foundations docs; fixes JSON import
  / implicit `any` build failures.
- Homepage URL set to the custom docs domain.

## 0.2.0 — 2026-11-14

- Added `@osmanjimenez/atralume/grid` (`atr-grid` / `atrGridItem`).
- Snackbar brand surfaces via `atr-snackbar-panel` (no Taiga inverse chrome).
- Switch thumb without Taiga check ghost; table expander uses `atr-icon`.
- Storybook visual polish: menus/dropdowns, dialog gutter, cards, nav icons,
  command palette title, textarea focus ring.

## 0.1.x

- First public preview publishes of `@osmanjimenez/atralume` on npm.
