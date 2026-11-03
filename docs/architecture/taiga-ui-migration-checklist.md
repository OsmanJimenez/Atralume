# Taiga UI + Atralume brand-layer checklist

Date: 2026-11-02 (replanteado)  
Doctrine: [ADR-001](./adr/ADR-001-use-taiga-ui-as-component-foundation.md)

## Product model

Atralume **no** es un segundo kit de componentes. Es la capa de marca:

| Mode attribute | Effect |
| -------------- | ------ |
| `data-atr-theme` | light / dark / system |
| `data-atr-surface` | standard / elevated / glass / transparent |
| `data-atr-shape` | sharp / rounded / pill (radios → `--tui-radius-*`) |
| `data-atr-brand` | default / green (accent → primary tokens → bridge) |

Bootstrap:

```ts
import { provideAtralume } from "@atralume/angular";
// providers: [provideAtralume()]
// + wrap app shell with <tui-root> (dropdown/dialog portal host)
// + @import "@atralume/angular/styles/theme.css";
```

## Ola 0 (plataforma) — done

| Item | Status |
| ---- | ------ |
| ADR amended (brand layer, no parallel kit) | Done |
| `provideAtralume()` | Done |
| Modes CSS (`modes.scss`) shape + brand | Done |
| Storybook toolbar theme/surface/shape/brand | Done |
| Matrix: `exception` → `pending` | Done |
| Token bridge still maps `--tui-*` ← `--atr-*` | Done |

## Ola 1 — Forms core — done

| Surface | Taiga | Notes |
| ------- | ----- | ----- |
| Form field | chrome shell + consumer `tui-textfield`/`TuiLabel` | Hint/error below; label lives in consumer textfield |
| Input | `TuiInputDirective` | Must live inside consumer `tui-textfield` |
| Textarea | `TuiTextareaComponent` | Same; keeps optional `resize` |
| Checkbox | `TuiAppearance`+`TuiIcons` + `[tuiCheckbox]` | Native-first (no `TuiCheckbox` host) |
| Radio | `TuiAppearance`+`TuiNativeValidator` + `[tuiRadio]` | Native-first (no `TuiRadioComponent` host) |
| Switch | `TuiAppearance`+`TuiIcons` + `[tuiSwitch]` | Native-first (no `TuiSwitch` host) |
| Browser | 91/91 stories OK | `:6008` after Ola 1 |

## Remaining waves (pending → migrated/composed)

### Ola 2 — Selection — done
| Surface | Status | Notes |
| ------- | ------ | ----- |
| Select | migrated (thin) | `atrSelect` → `TuiSelectDirective`; recipe `TuiSelect` + `tui-data-list-wrapper` |
| Combobox | migrated (thin) | `atrComboBox` → `TuiComboBoxDirective`; filter via `tuiFilterByInput` |
| Autocomplete | migrated (thin) | Alias over combobox (`strict` default false) |
| Listbox | migrated (thin) | `tui-data-list-wrapper` + `itemClick` model |
| Option | migrated (thin) | `button[atrOption]` → `TuiOption`; legacy `atr-option` component removed |
| File upload | migrated (composed) | `label[tuiInputFiles]` chrome; `atrFileInput` attr+appearance (no stacked CVA); list/progress kept |
| Slider / Range | migrated (thin) | `atr-range-slider` → `tui-range` + inner FormControl; `{start,end}` ↔ `[number,number]` |

### Ola 3 — Date/time — migrated
| Surface | Status | Notes |
| ------- | ------ | ----- |
| Calendar | migrated (thin) | `tui-calendar` / `tui-calendar-range`; public `Date`/`{start,end}` ↔ `TuiDay` |
| Date picker | migrated (thin) | `TuiInputDate` / `TuiInputDateRange` + `ng-template tuiDropdown`; drop custom popover/dialog |
| Time picker | migrated (thin) | `TuiInputTime`; public `AtralumeTimeValue` ↔ `TuiTime`; `[mode]` for 12h/seconds |

### Ola 4 — Navigation / disclosure / media — migrated (92/92)
| Surface | Status | Notes |
| ------- | ------ | ----- |
| Pagination | migrated (thin) | `tui-pagination`; 1-based `page` ↔ 0-based `index` |
| Breadcrumbs | migrated (thin) | `tui-breadcrumbs` + `*tuiItem`; separators/overflow deprecated |
| Accordion | migrated (thin) | Direct `tui-accordion` + sibling `button[tuiAccordion]`/`tui-expand` |
| Carousel | migrated (thin) | `tui-carousel` + `[duration]` autoplay; slides DTO kept |
| Tabs | migrated | `tui-tabs[atrTabList]` + `atrTab`→`TuiTab`; string-id panels kept |
| Stepper | migrated (thin) | `tui-stepper` + `button[tuiStep]`; content panel recipe |
| Side nav | migrated | `aside[tuiNavigationAside]`; items=`TuiButton` (projection-safe) |
| Nav bar | migrated | `<atr-navigation-bar>` → `nav[tuiNavigationNav]` |
| Tree | composed | `tui-tree` in DOM; expansion map / multi-select a11y deferred |
| Icon | composed | registry default + optional `engine="tui\|auto"` → `TuiIcon` |

### Ola 5 — Overlays / gaps — done
| Surface | Status | Notes |
| ------- | ------ | ----- |
| Popover | migrated | Trigger `[atrPopover]` → `TuiDropdown` + `TuiDropdownOpen`; appearance `atr-popover` |
| Bottom sheet | migrated | `TuiDialogService` + `appearance: atr-bottom-sheet` CSS dock; `mode` retained no-op-ish |
| Divider | migrated | Native `hr`/separator + divider tokens (no Taiga primitive) |
| Table | migrated | `@taiga-ui/addon-table` `tuiTable`/`tuiTh`/`tuiTd`; optional peer |
| Thin SCSS | done | Popover/bottom-sheet appearance + glass hooks in `overlays.scss` |

### Ola 6 — Cleanup — done (wave complete)
| Item | Status | Notes |
| ---- | ------ | ----- |
| Overlay open/connected engines | removed | Slim `ɵAtralumeOverlayInfrastructure` keeps decorate/dismissal for CDK Menu only |
| Legacy combobox popup/input/trigger | removed | Dead directives deleted from `@atralume/angular/combobox` |
| Tooltip panel | removed | Unused `atr-tooltip-panel` deleted |
| Legacy `atr-option` + `LISTBOX_CONTEXT` | removed | Prefer `button[atrOption]` → `TuiOption` |
| Peers required | done | `@taiga-ui/cdk|core|kit|layout|addon-table|polymorpheus` required; `@angular/forms` optional |
| Matrix | done | 0 pending / 0 in-progress / 0 exception |
| Docs | done | Checklist + final report + `docs/migrations/taiga-ui.md` |
| Storybook CI + browser validate | done | OK **92/92** on `:6008` after Ola 6 cleanup |

## Wave status

**Olas 0–6 complete.** Terminal statuses only: `migrated` | `composed` | `removed`.

## Done criteria (per surface)

1. Public Taiga primitive or documented Taiga/CDK composition.
2. No parallel Atralume UI engine.
3. Look from tokens + modes (glass/shape/brand change the control globally).
4. Story + DOM show Taiga host; lib/storybook build green.
5. Matrix `migrated` or `composed`.
