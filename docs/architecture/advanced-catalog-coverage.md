# Advanced catalog coverage matrix

Audit of the additional catalogue proposed for Atralume’s evolution beyond the
basic Taiga migration inventory. Strategy follows ADR-001: **reuse Taiga UI /
CDK first**, compose when needed, create thin `atr*` adapters only when they add
brand tokens, stable public API, or accessibility value.

Versions audited: Angular 22.2.4 · Taiga UI 5.31.0 · Storybook 10.6.5 · Nx 23.2.1.

## Legend

| Action | Meaning |
| --- | --- |
| Reutilizar | Already shipped in Atralume |
| Componer | Build from existing Atralume + Taiga without a new primitive |
| Crear | Thin adapter / composition entrypoint justified |
| Omitir | Covered by tokens, CSS, docs, or Taiga recipe; no new package |
| Documentar | Storybook composition / MDX recipe |

Priorities: **P0** fundamentals · **P1** productivity · **P2** advanced.

---

## A. Atoms

| Componente o capacidad | Categoría | Cobertura actual | Solución existente | Prioridad | Acción |
| --- | --- | --- | --- | --- | --- |
| Typography | Átomo / Foundations | Parcial | Foundations tokens + `typography.mdx` | P0 | Omitir (tokens/docs) |
| Icon | Átomo | Completa | `AtralumeIcon` / optional `TuiIcon` | P0 | Reutilizar |
| Avatar | Átomo | Completa | `AtralumeAvatar` → `TuiAvatar` | P0 | Reutilizar |
| AvatarGroup | Átomo | Nula | Taiga `TuiAvatarStack` | P0 | Crear (en entrypoint `avatar`) |
| StatusIndicator | Átomo | Parcial | Badge tones; Taiga `TuiStatus` | P0 | Crear (`status`) |
| Kbd | Átomo | Nula | Native `<kbd>` + tokens | P0 | Crear (`kbd`) |
| Link | Átomo | Completa | `AtralumeLink` → `TuiLink` | P0 | Reutilizar |
| CopyButton | Átomo | Nula | Taiga `TuiButtonCopy` / `TuiCopy` | P0 | Crear (`copy-button`) |
| TruncatedText | Átomo | Nula | Taiga `TuiLineClamp` | P0 | Crear (`truncated-text`) |
| HighlightText | Átomo | Nula | App-level / pipe | P2 | Omitir |
| FileTypeIcon | Átomo | Nula | Icon registry + app mapping | P2 | Omitir |
| AspectRatio | Átomo | Nula | CSS `aspect-ratio` | P1 | Documentar (utility CSS) |
| Grid layout | Átomo / layout | Completa (0.2.0) | `AtralumeGrid` / `atr-grid` + `atrGridItem` | P0 | Reutilizar |
| VisuallyHidden | Átomo | Nula | CSS sr-only pattern | P0 | Crear (directive + CSS) |

## B. Molecules

| Componente o capacidad | Categoría | Cobertura actual | Solución existente | Prioridad | Acción |
| --- | --- | --- | --- | --- | --- |
| FileItem / FileMetadata | Molécula | Parcial | `AtralumeFileUpload` list chrome | P1 | Componer / Documentar |
| SearchSuggestions | Molécula | Parcial | Autocomplete / Combobox | P1 | Reutilizar |
| Combobox | Molécula | Completa | `AtralumeCombobox` → `TuiComboBox` | P0 | Reutilizar |
| PasswordField | Molécula | Nula | Taiga `TuiPassword` on textfield icon | P0 | Documentar (recipe) |
| OTPInput | Molécula | Nula | Taiga `TuiInputPin` / `TuiPincode` | P0 | Crear (`otp-input`) |
| Rating | Molécula | Nula | Taiga `TuiRating` | P0 | Crear (`rating`) |
| StatCard | Molécula | Nula | `AtralumeCard` composition | P1 | Documentar |
| DateRangePicker | Molécula | Completa | DatePicker `selectionMode="range"` | P0 | Reutilizar |
| TagInput | Molécula | Parcial | Chip set; Taiga `TuiInputChip` | P1 | Crear (later) |
| QuantitySelector | Molécula | Nula | Input number / buttons | P1 | Componer |
| ShortcutHint | Molécula | Nula | Kbd + Tooltip | P1 | Componer |
| InlineEdit | Molécula | Nula | Taiga `TuiInputInline` | P1 | Crear (later) |
| FilterBar | Molécula | Completa | `AtralumeFilter` → `TuiFilter` | P1 | Reutilizar |
| Image | Molécula / media | Completa | `AtralumeImage` (native + skeleton) | P0 | Reutilizar |
| ImagePreview | Molécula / media | Completa | `AtralumeImagePreview` → dialog + `TuiPreview` | P0 | Reutilizar |
| ImageGallery / mosaic | Organismo / media | Completa | `AtralumeImageGallery` (`carousel` \| `mosaic`) | P0 | Reutilizar |
| EmptyState | Molécula | Completa | `AtralumeEmptyState` → `TuiBlockStatus` | P0 | Reutilizar |
| Destination exploration recipe | Patrón | Completa | Playground `atr-exploration-demo` | P0 | Documentar |
| KeyValueList | Molécula | Nula | List / description list | P1 | Documentar |

## C. Organisms

| Componente o capacidad | Categoría | Cobertura actual | Solución existente | Prioridad | Acción |
| --- | --- | --- | --- | --- | --- |
| AppShell | Organismo | Parcial | Nav bar + side nav + layout | P1 | Documentar |
| TreeView | Organismo | Completa | `AtralumeTree` → `TuiTree` | P0 | Reutilizar |
| DataGrid | Organismo | Completa | `AtralumeTable` → `TuiTable` | P0 | Reutilizar |
| CommandPalette | Organismo | Completa | `AtralumeCommandPalette` | P0 | Reutilizar |
| Stepper | Organismo | Completa | `AtralumeStepper` → `TuiStepper` | P0 | Reutilizar |
| Timeline | Organismo | Nula | Taiga `TuiTimeline` | P1 | Crear (later) |
| ActivityFeed | Organismo | Nula | List + Avatar + time | P2 | Componer |
| NotificationCenter | Organismo | Parcial | Snackbar / Taiga Push / Toast | P2 | Documentar |
| AdvancedFileExplorer | Organismo | Nula | Tree + FileUpload + List | P2 | Omitir |
| MultiSelectToolbar | Organismo | Nula | Taiga `TuiActionBar` | P1 | Crear (later) |
| MasterDetailLayout | Organismo | Nula | Side nav + content | P1 | Documentar |
| DashboardLayout | Organismo | Parcial | Phase3 dashboard demo | P1 | Documentar |
| ContentSwitcher | Organismo | Parcial | Tabs; Taiga `TuiSegmented` | P1 | Crear (later) |

## D. Patterns (prefer docs / composition)

| Patrón | Cobertura | Prioridad | Acción |
| --- | --- | --- | --- |
| Responsive nav (mobile/desktop) | Side nav + nav bar | P1 | Documentar |
| Contextual toolbars | Action bar / menus | P1 | Documentar |
| Search + filters + results | Combobox + chips | P1 | Documentar |
| Destination exploration (hero + filters + mosaic + preview + empty) | Playground exploration demo + media APIs | P0 | Documentar |
| Multi-select + bulk actions | Table + ActionBar | P1 | Documentar |
| Long forms + validation | Form field recipes | P0 | Reutilizar / Documentar |
| Destructive confirmations | Dialog / Confirm | P0 | Documentar (Taiga `TuiConfirm`) |
| Keyboard navigation | Component contracts | P0 | Reutilizar |
| Drag and drop | Angular CDK DnD | P2 | Documentar |
| Hierarchical navigation | Tree + breadcrumbs | P0 | Reutilizar |
| Preferences panels | Dialog + forms | P2 | Documentar |
| Long content | TruncatedText + tabs | P0 | Crear TruncatedText |
| Multi-panel layouts | CSS / app shell | P2 | Documentar |

## E. Cross-cutting

| Capacidad | Cobertura | Solución | Prioridad | Acción |
| --- | --- | --- | --- | --- |
| Design tokens / themes / glass | Completa | Style Dictionary + bridge | P0 | Reutilizar |
| WCAG 2.2 AA tooling | Completa | Storybook a11y addon | P0 | Reutilizar |
| i18n / RTL | Parcial | Taiga i18n tokens; logical CSS | P1 | Documentar |
| Visual regression | Parcial | Playwright scripts present | P2 | Reutilizar (no new vendor) |
| Chromatic | Nula | Paid | P2 | Omitir (needs auth) |

## External integrations decision

| Tool | Needed? | Decision |
| --- | --- | --- |
| Angular CDK | Already peer | Keep (overlay, a11y, clipboard via Taiga) |
| Storybook a11y / docs | Installed | Keep |
| New icon packs | No | Use existing registry + Taiga icons |
| New i18n library | No | Defer; Taiga texts + consumer i18n |
| Chromatic | No | Do not install |

## P0 implementation set (this initiative)

| Item | Entrypoint / location | Status |
| --- | --- | --- |
| AvatarGroup | `@osmanjimenez/atralume/avatar` (`atr-avatar-group`) | Implemented |
| Status | `@osmanjimenez/atralume/status` | Implemented |
| Rating | `@osmanjimenez/atralume/rating` | Implemented |
| CopyButton | `@osmanjimenez/atralume/copy-button` | Implemented (CDK Clipboard + `TuiButton`; `TuiButtonCopy` cannot hostDirectives) |
| TruncatedText | `@osmanjimenez/atralume/truncated-text` | Implemented |
| OtpInput | `@osmanjimenez/atralume/otp-input` | Implemented |
| Kbd | `@osmanjimenez/atralume/kbd` | Implemented |
| VisuallyHidden | `@osmanjimenez/atralume/visually-hidden` | Implemented |
| PasswordField | Forms/Password Field recipe | Documented (no package) |

Deferred P1/P2 remain listed above for later waves.
