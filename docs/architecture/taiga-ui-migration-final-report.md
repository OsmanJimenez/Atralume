# Taiga UI 5 + Atralume brand layer — final report

Date: 2026-11-02 (Ola 6 complete)  
Scope: local workspace only.

## Executive summary

**Taiga UI 5** is the only component/interaction runtime. **Atralume** is the
brand and customization layer (tokens, theme bridge, modes). Parallel Atralume
UI engines are out of doctrine ([ADR-001](./adr/ADR-001-use-taiga-ui-as-component-foundation.md)).

```
Consumers → provideAtralume() + theme.css + data-atr-* modes
                 → thin atr* adapters
                       → Taiga UI 5
```

**Migration waves 0–6 are complete.** Matrix terminal recount: migrated **64**,
composed **2**, removed **1**; pending/in-progress/exception **0**.

## Delivered by wave

| Wave | Scope | Status |
| ---- | ----- | ------ |
| Ola 0 | ADR, `provideAtralume()`, modes, Storybook toolbar, matrix rewrite | Done |
| Ola 1 | Forms core (form-field, input, textarea, checkbox/radio/switch) | Done |
| Ola 2 | Selection (select, combobox, autocomplete, listbox, option, file upload, slider/range) | Done |
| Ola 3 | Date/time (calendar, date picker, time picker) | Done |
| Ola 4 | Navigation / disclosure / media | Done |
| Ola 5 | Overlays / gaps (popover, bottom sheet, divider, table) | Done |
| Ola 6 | Cleanup: dead engines, required peers, docs, matrix sweep | Done |

## Ola 6 cleanup specifics

- Removed CDK Dialog/`open`/`openConnected` paths from
  `ɵAtralumeOverlayInfrastructure`; retained decorate + Escape dismissal for
  CDK Menu portals only.
- Command palette / speed dial no longer inject the overlay engine (browser
  checks use `isPlatformBrowser`).
- Deleted unused `atr-tooltip-panel`, legacy `atr-option` + `LISTBOX_CONTEXT`,
  and dead combobox popup/input/trigger directives.
- Trimmed overlay SCSS to Taiga appearance selectors + menu/dialog chrome.
- Peers required: `@taiga-ui/cdk`, `core`, `kit`, `layout`, `addon-table`,
  `polymorpheus` (`@angular/forms` remains optional).

## Counts

| Status | Count | Meaning |
| ------ | ----- | ------- |
| migrated | 64 | Thin adapters / compositions on Taiga |
| composed | 2 | Icon (registry default), Tree (expansion deferred) |
| removed | 1 | Tooltip panel |
| pending / in-progress / exception | 0 | — |

## Justified composed leftovers

1. **Icon** — high blast if forced onto `TuiIcon`; optional `engine="tui|auto"`.
2. **Tree** — `tui-tree` present; expansion-map sync and multi-select a11y deferred.

## Bootstrap

```ts
import { provideAtralume } from "@atralume/angular";
// providers: [provideAtralume()]
```

```bash
npm install @atralume/angular \
  @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit @taiga-ui/layout \
  @taiga-ui/addon-table @taiga-ui/polymorpheus
```

## Validations

| Check | Result |
| ----- | ------ |
| Doctrine docs / matrix / checklist | Updated (Ola 6 done) |
| `nx run angular:build` | Successfully ran (Ola 6) |
| `nx build-storybook angular --configuration=ci` | Successfully ran (post–Ola 6) |
| Browser validate (`tools/browser-validate-storybook.mjs` :6008) | **OK 92/92** |
| ESLint / unit tests | Deferred to wave-close preference |
