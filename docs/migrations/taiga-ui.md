# Taiga UI 5 + Atralume brand layer

Taiga UI 5 is the UI runtime. Atralume supplies tokens, the theme bridge, and
modes. Thin `atr*` adapters may exist; they must not reimplement Taiga.

**Status (Ola 6):** migration waves complete — matrix
`migrated` / `composed` / `removed` only (0 pending). See the
[migration matrix](../architecture/taiga-ui-migration-matrix.md),
[checklist](../architecture/taiga-ui-migration-checklist.md), and
[final report](../architecture/taiga-ui-migration-final-report.md).

## Installation

```bash
npm install @atralume/angular \
  @taiga-ui/core @taiga-ui/cdk @taiga-ui/kit @taiga-ui/layout \
  @taiga-ui/addon-table @taiga-ui/polymorpheus
```

Use peer versions from `@atralume/angular/package.json`. All listed Taiga
packages are **required** peers (including `@taiga-ui/addon-table` for Table).
Call `provideAtralume()` once (registers Taiga providers) and wrap the app
shell with `<tui-root>` so dropdowns, dialogs, and hints have a portal host.

```ts
import { provideAtralume } from "@atralume/angular";

export const appConfig: ApplicationConfig = {
  providers: [provideAtralume()],
};
```

```html
<!-- app.component.html -->
<tui-root>
  <router-outlet />
</tui-root>
```

```css
@import "@atralume/angular/styles/theme.css";
```

## Brand modes

Set attributes on `html`, `body`, or any scope:

| Attribute | Values |
| --------- | ------ |
| `data-atr-theme` | `light` \| `dark` \| `system` |
| `data-atr-surface` | `standard` \| `elevated` \| `glass` \| `transparent` |
| `data-atr-shape` | `sharp` \| `rounded` \| `pill` |
| `data-atr-brand` | `default` (omit) \| `green` |

Modes update `--atr-*`; the bridge maps them to `--tui-*` so Taiga controls
follow the brand without per-component CSS.

## Component contract

Import thin adapters from secondary entrypoints when documented:

```ts
import { AtralumeButton } from "@atralume/angular/button";
```

Prefer aligning new work to Taiga hosts. Do not stack undocumented Taiga
directives on the same host. Do not import Taiga internals.

## Breaking notes (selected)

### Forms

- `atr-form-field` is brand chrome only (hint/error/density attrs). Author a
  consumer `tui-textfield` with `label[tuiLabel]` and `input[atrInput]` /
  `textarea[atrTextarea]` inside it.
- `atrInput` / `atrTextarea` require a `tui-textfield` ancestor in the same
  consumer template tree (`TuiTextfield` is re-exported from
  `@atralume/angular/form-field`).
- `atrCheckbox` / `atrRadio` / `atrSwitch` stay native-first: `TuiAppearance` +
  `[tuiCheckbox|tuiRadio|tuiSwitch]` attrs.

### Selection

- `atr-select` / `atr-combobox` are single-value Taiga recipes
  (`tuiSelect` / `tuiComboBox` + `tui-data-list-wrapper`). Legacy combobox
  popup/input/trigger directives were removed.
- `button[atrOption]` → `TuiOption`. The old `atr-option` component was removed.

### Overlays

- Popover is trigger-hosted `TuiDropdown` (`[atrPopover]`).
- Bottom sheet uses `TuiDialogService` with `appearance: atr-bottom-sheet`.
- Shared overlay *open* engines were removed; CDK Menu still uses slim
  decorate/dismissal helpers.

### Composed leftovers

- **Icon** — registry default; optional `engine="tui|auto"`.
- **Tree** — `tui-tree` in DOM; expansion / multi-select a11y deferred.
