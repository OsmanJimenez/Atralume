# Taiga UI inventory classification (Atralume)

Classification of the Taiga UI documentation catalogue against Atralume’s
brand-layer doctrine ([ADR-001](./adr/ADR-001-use-taiga-ui-as-component-foundation.md)):

**reuse / compose / document / omit** — do not wrap every Taiga primitive.

Audited with Taiga MCP (`get_list_components`) against Taiga UI **5.x** docs and
the shipped `@osmanjimenez/atralume@0.2.4` secondary entries.

## Legend

| Acción | Meaning |
| --- | --- |
| **Reutilizar** | Shipped Atralume adapter / composition (`atr*`) |
| **Componer** | Build from existing Atralume + public Taiga without a new package |
| **Documentar** | Storybook / MDX recipe; consumers import Taiga (or Atralume hosts) directly |
| **Omitir** | Out of scope for the brand kit (addon niche, experimental, or CSS/tokens cover it) |

## Summary

| Acción | Count (user-facing sections) |
| --- | --- |
| Reutilizar | ~45 |
| Componer / Documentar | ~35 |
| Omitir | ~25 (charts, commerce card, experimental, most mobile-only, low-value chrome) |

Principle: Atralume owns tokens, theme bridge, and stable `atr*` where they add
brand API or a11y. Everything else stays Taiga + docs.

---

## Getting Started

| Item | Acción | Atralume surface |
| --- | --- | --- |
| Getting Started | Documentar | `docs/`, Storybook Introduction / Getting Started |

---

## Components (KIT / CORE / LAYOUT)

| Taiga | Acción | Atralume / notes |
| --- | --- | --- |
| Accordion | Reutilizar | `@osmanjimenez/atralume/accordion` |
| ActionBar | Reutilizar | `@osmanjimenez/atralume/action-bar` |
| Avatar | Reutilizar | `@osmanjimenez/atralume/avatar` (+ AvatarStack in entry) |
| Badges (`Badge`, `BadgeNotification`, `BadgedContent`) | Reutilizar / Documentar | `badge` shipped; notification/badged content → docs recipes |
| Buttons (`Button`, `ButtonGroup`, `ButtonSelect`, `ButtonX`) | Reutilizar / Documentar | `button`, `icon-button`, `fab`; group/select/X → docs |
| Calendars (`Calendar`, `CalendarMonth`, `CalendarRange`, experimental) | Reutilizar / Omitir | `calendar`, `date-picker`; experimental → omit |
| Carousel | Reutilizar | `carousel` |
| Chip | Reutilizar | `chip` / `chip-set` |
| Comment | Documentar | Low-frequency; compose Avatar + text |
| Compass | Omitir | Niche KIT widget |
| Copy | Reutilizar | `copy-button` |
| Counter | Documentar | Badge / status tone recipe |
| Dropdown* | Reutilizar / Documentar | Covered by `menu`, `select`, `combobox`, `popover` |
| Expand | Documentar | Used inside accordion; no standalone package |
| File / InputFiles | Reutilizar | `file-upload` |
| Filter | Reutilizar | `filter` |
| Hint* | Reutilizar | `tooltip` (`TuiHint`) |
| Icon | Reutilizar | `icon` + **`icon/catalog`** (metadata entry) |
| ItemsWithMore | Documentar | Compose chips / menu overflow |
| Keypad | Omitir / Documentar | Mobile addon; OTP uses `otp-input` |
| Like | Documentar | Icon button + state; no wrapper |
| LineClamp | Reutilizar | `truncated-text` |
| Link | Reutilizar | `link` |
| Loader | Reutilizar | `progress` spinner (indeterminate → `TuiLoader`) |
| Message | Documentar | Notification / card chrome |
| Meter | Documentar | Progress / slider composition |
| Mobile (`MobileCalendar`, `PullToRefresh`, `Keypad`, …) | Omitir / select | `bottom-sheet` kept; rest optional peer later |
| Modals (`Dialog`, `Confirm`, `SheetDialog`) | Reutilizar / Documentar | `dialog`; confirm → Patterns; sheet → `bottom-sheet` |
| Notification / Toast / Push | Reutilizar / Documentar | `snackbar` (`TuiNotificationService`); Push → docs |
| Pager | Documentar | Carousel indicators |
| Pin / Pincode | Reutilizar / Documentar | `otp-input`; map pin → docs |
| Popout | Omitir | Experimental |
| Preview | Reutilizar | `image-preview` |
| Progress (`Bar`, `Circle`, `Segmented`) | Reutilizar | `progress` |
| Pulse | Documentar | Status / CSS |
| ScrollWheel | Omitir | Niche |
| Scrollbar | Documentar | CSS / Taiga directive |
| ShrinkWrap | Omitir | Layout helper |
| Status | Reutilizar | `status` |
| Surface | Documentar | `data-atr-surface` modes + tokens |
| Table (+ filters / pagination) | Reutilizar / Documentar | `table`; table filters → docs |
| ThumbnailCard | Omitir / Documentar | Commerce-adjacent; card recipe |
| Tiles | Documentar | CSS grid / `grid` |
| Timeline | Reutilizar | `timeline` |
| Title | Documentar | Typography foundations |
| Tree | Reutilizar | `tree` (composed) |
| ComboBox | Reutilizar | `combobox` (+ `autocomplete`) |
| Error | Documentar | Form-field error slot / `TuiError` recipe |
| Form | Documentar | Layout directive; form-field recipes |
| Inputs (text, number, date*, phone*, color, chip, inline, year, …) | Reutilizar / Documentar | `input`, `date-picker`, `time-picker`, `otp-input`; specialty inputs → docs |
| Label | Reutilizar | Via `form-field` / `TuiLabel` |
| Rating | Reutilizar | `rating` |
| Select | Reutilizar | `select` |
| Sliders / Range / InputSlider | Reutilizar / Documentar | `slider`; range recipes in docs |
| Textarea | Reutilizar | `textarea` |
| Toggles (`Checkbox`, `Radio`, `Switch`) | Reutilizar | `checkbox`, `radio`, `switch` |

---

## Layout / navigation

| Taiga | Acción | Atralume / notes |
| --- | --- | --- |
| AppBar | Documentar / Componer | `navigation-bar` + layout |
| BlockDetails | Documentar | Card / description list |
| BlockStatus | Reutilizar | `empty-state` |
| Cards (`CardLarge`, `CardMedium`, `CardCollapsed`) | Reutilizar | `card` |
| Cell | Documentar | List / table cell chrome |
| Drawer | Documentar | Prefer `side-navigation` / `bottom-sheet`; horizontal drawer recipe |
| ElasticContainer | Omitir | Layout helper |
| FloatingContainer | Documentar | Overlay / popover hosts |
| Group | Documentar | Button/form group CSS |
| Header | Documentar | App shell recipe |
| ItemGroup | Documentar | List grouping |
| List | Reutilizar | `list` |
| Search / SearchBar | Documentar | `autocomplete` / `command-palette` |
| Slides | Documentar | Via `carousel` |
| Breadcrumbs | Reutilizar | `breadcrumbs` |
| Navigation | Reutilizar | `navigation-bar`, `side-navigation` |
| Pagination | Reutilizar | `pagination` |
| Segmented | Reutilizar | `content-switcher` |
| Stepper | Reutilizar | `stepper` |
| TabBar | Documentar | Mobile tab bar recipe |
| Tabs | Reutilizar | `tabs` |

---

## Charts (`@taiga-ui/addon-charts`)

| Taiga | Acción | Notes |
| --- | --- | --- |
| ArcChart, Axes, Bar, BarChart, BarSet, LegendItem, LineChart, LineDaysChart, PieChart, RingChart | **Omitir** | Not Atralume peers; apps depend on addon-charts directly |

---

## Commerce / experimental / misc

| Taiga | Acción | Notes |
| --- | --- | --- |
| InputCard / InputCardGroup / Amount / Currency | Omitir | `@taiga-ui/addon-commerce` |
| PdfViewer | Omitir / Documentar | App-level |
| CalendarExperimental / File (experimental) / Popout | Omitir | Unstable docs surface |
| Sensitive / Obfuscate / Shimmer | Documentar | Shimmer ≈ `skeleton` |
| Skeleton | Reutilizar | `skeleton` |
| Reorder / Resizer / Swipe* / Zoom / Pan | Documentar | CDK / Taiga gestures as needed |
| Dark mode / Theme / Tokens / Variables | Reutilizar | Atralume tokens + bridge |
| Internationalization | Documentar | Taiga i18n providers |
| Directives / Pipes / Services / Utils | Documentar selectively | No blanket re-exports |

---

## Shipped Atralume secondary entries (verify list)

`accordion`, `action-bar`, `autocomplete`, `avatar`, `badge`, `bottom-sheet`,
`breadcrumbs`, `button`, `calendar`, `card`, `carousel`, `checkbox`, `chip`,
`combobox`, `command-palette`, `content-switcher`, `copy-button`, `date-picker`,
`dialog`, `divider`, `empty-state`, `fab`, `file-upload`, `filter`, `form-field`,
`grid`, `icon`, **`icon/catalog`**, `icon-button`, `image`, `image-360`,
`image-gallery`, `image-preview`, `input`, `kbd`, `link`, `list`, `listbox`,
`menu`, `navigation-bar`, `otp-input`, `pagination`, `popover`, `progress`,
`radio`, `rating`, `select`, `side-navigation`, `skeleton`, `slider`, `snackbar`,
`speed-dial`, `status`, `stepper`, `switch`, `table`, `tabs`, `textarea`,
`time-picker`, `timeline`, `tooltip`, `tree`, `truncated-text`, `visually-hidden`,
`internal/forms`.

---

## Icon packaging note (0.2.3+ / 0.2.4 paint path)

- Default `@osmanjimenez/atralume/icon` stays light (registry + `atr-icon`).
- Full ~2191-entry metadata lives in `@osmanjimenez/atralume/icon/catalog`.
- Storybook Icon stories import local modules (not the catalog barrel).
- Generator: `npm run icons:manifest` → `libs/angular/icon/catalog/src/lib/icon-manifest.generated.ts`.
- Storybook serves normalized Lucide SVGs (`npm run icons:normalize`, stroke-width fixed for CSS masks); `engine="tui"` uses `.atr-icon__tui-glyph`, not `<tui-icon>`.

---

## What “migrated” means here

Migration is **complete for the brand kit scope**: every Atralume-owned control
hosts or composes public Taiga. The inventory above is **not** a backlog to wrap
the remaining ~150 Taiga docs pages. Gaps are intentional **Documentar** /
**Omitir** decisions unless product priority promotes them to a thin `atr*` entry.
