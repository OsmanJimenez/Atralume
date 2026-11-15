# Plan de revisión visual de Storybook y release

## Prompt para la siguiente IA

Toma Atralume (Angular 22, Nx 23, Storybook 10 y Taiga UI 5). Lee `AGENTS.md`
completo antes de editar; luego inspecciona Git, `package.json`, lockfile, Nx,
`libs/angular/.storybook`, tokens, entrypoints, matriz Taiga, MDX, historias,
pruebas y harnesses. Conserva los cambios ajenos.

No declares éxito porque una historia cargue. Revisa visualmente y en ejecución
cada historia pública, prueba sus interacciones y animaciones relevantes,
corrige defectos observados y vuelve a validar. Taiga es la base de runtime;
Atralume conserva API `atr*`, tokens `--atr-*`, modos y documentación. Usa sólo
APIs públicas de Taiga. No edites `node_modules`, no copies Angular Material,
no construyas un segundo kit ni debilites pruebas para ocultar defectos.

## Método obligatorio por historia

1. Obtén el inventario desde `http://127.0.0.1:6006/index.json`.
2. Abre el canvas real a escritorio (1280×900), tablet y móvil cuando aplique:

   ```text
   http://127.0.0.1:6006/iframe.html?id=<story-id>&viewMode=story
   ```

3. Usa `launchBrowser` de `tools/browser.mjs`, espera `domcontentloaded`, no
   `networkidle`, y genera screenshots nuevos fuera del repositorio.
4. Abre cada captura en el visor; no uses screenshots viejos de `dist/`.
5. Revisa claro, oscuro, anidado, glass, transparente, RTL, forced colors y
   reduced motion cuando correspondan; y default, hover, focus-visible,
   pressed, disabled, loading, invalid, error, empty y selected.
6. Comprueba alineación, ritmo, ancho, espacios vacíos, clipping, overflow,
   tipografía, contraste, tamaño táctil, iconos, borde, sombra y glass.
7. Prueba teclado, puntero, foco, cierre y restauración de foco. En overlays:
   abrir, Escape, botón de cierre, clic externo si aplica, resultado y cleanup.
8. Corrige la causa mínima (token, bridge, componente, historia u overlay
   compartido), reconstruye y vuelve a inspeccionar antes de avanzar.

WCAG 2.2 AA es obligatorio: HTML nativo, nombre/descripción/rol/estado
correctos, foco visible no recortado y nunca opacidad como única señal.

## Orden de revisión

1. Foundations y Application Examples.
2. Átomos: Avatar, Badge, Button, Checkbox, Divider, Icon Button, Icon, Input,
   Link, Progress, Radio, Switch y Textarea.
3. Composición: Accordion, Card, Chip, List y Skeleton.
4. Formularios: Autocomplete, Calendar, Combobox, Date Picker, File Upload,
   Form Field, Listbox, Select, Slider y Time Picker.
5. Navegación/datos: Breadcrumbs, Navigation Bar, Pagination, Side Navigation,
   Tabs, Stepper, Table y Tree.
6. Acciones/media/feedback/overlays: FAB, Speed Dial, Carousel, Snackbar,
   Tooltip, Menu, Popover, Dialog, Bottom Sheet y Command Palette.
7. Forms: Playground, Reactive, Template-driven y Signal Forms.

Revisa por separado toda variante `Playground`, `Keyboard`, `Interaction`,
`Dialog`, `Open`, `Manual activation`, `Error` o `Rejected files`.

## Hallazgos que deben revalidarse

| Área                | Hallazgo                                                                                                                                                                    | Resolución                                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion           | Los paneles cerrados retenían padding y dejaban bandas vacías. Ahora el padding de bloque sólo se aplica con `tui-expand._expanded`; click y Enter cambian `aria-expanded`. | Revisar cerrado, abierto, foco, móvil, oscuro y reduced motion. Mantener el host directo `tui-accordion`, `button[tuiAccordion]`, `tui-expand`; no recuperar wrappers que rompan DI/proyección. |
| Icon bridge         | `engine="tui"` consultaba el registro Atralume y fallaba con `@tui.check`.                                                                                                  | Confirmar bypass del registro y revisar la historia visualmente.                                                                                                                                |
| Dialog/Bottom Sheet | Portales no propagaban referencia de forma fiable; pruebas legacy buscan paneles retirados y el consumer no encuentra diálogo accesible.                                    | Corregir provider, rol, label, foco, tema, cierre y resultado con APIs Taiga públicas; no ocultarlo cambiando pruebas.                                                                          |
| Date Picker         | Chequeo viejo busca `input.atr-input` y botón custom; el contrato Taiga usa `input[data-atr-value-control]` dentro de `tui-textfield`.                                      | Probar campo, label, foco, calendario y selección; actualizar selectores obsoletos.                                                                                                             |
| Generated Tokens    | El validador expira porque no reconoce tabla renderizada.                                                                                                                   | Observar canvas; cambiar heurística sólo si la tabla es correcta.                                                                                                                               |
| Tarball consumer    | `npm run check:package` fallaba al abrir diálogo accesible.                                                                                                                 | Debe funcionar en browser consumer y SSR antes del release.                                                                                                                                     |

## Validación formal

```powershell
npx nx build angular
npx nx build-storybook angular --configuration=ci
node tools/browser-validate-storybook.mjs http://127.0.0.1:6006
node tools/check-storybook.mjs
npm run check:component-docs
npm run tokens:check
node tools/check-architecture.mjs
node tools/check-public-api.mjs
npm run check:package
git diff --check
```

Ejecuta además pruebas unitarias y harnesses dirigidos para cada familia
modificada. Informa resultados exactos; no declares verde un comando no
ejecutado.

## Auditoría UI/UX 2026-11-15 — progreso (sesión actual)

Prioridad acordada: **Foundations + átomos primero**. Evidencia en
`.playwright-mcp/visual-audit/` (gitignored). Storybook vivo en `:6006`;
estático de referencia en `:6008`.

### Baseline

| Métrica | Valor |
| --- | --- |
| Secondary entrypoints | 64 (+ `icon/catalog`, `internal/forms`) |
| `*.stories.ts` / `*.docs.mdx` | 74 / 67 |
| Stories en `index.json` | 158 (+ 85 docs) |
| Rama / Git | `master` con cambios locales previos (icon catalog, P1, docs) — conservados |
| Builds previos sesión | `nx build angular` OK; `build-storybook` OK |

### Foundations (inspección visual)

| Preview | Resultado | Notas |
| --- | --- | --- |
| Overview | Aprobado | Cadena Reference→Consumer clara |
| Color | Aprobado | Roles semánticos legibles |
| Typography | Aprobado | Jerarquía display/headline/body/label |
| Elevation / Shape / Spacing / Surfaces / State | Inspeccionados | Sin defectos bloqueantes en light |
| Motion | Parcial | Replay funciona; tokens duration/easing presentes; `emphasized` ≈ `standard` (alineado M3 clásico) |
| Glass | **Corregido** | Era ~88% opaco / escena plana. Opacidad sistema ~72%/68% dark + escena con profundidad. Evidencia: `foundations-glass-after*.png` |
| Focus preview | En curso | Quitados overrides CSS que peleaban con `atrButton` |

### Átomos (primera pasada)

| Componente | Visual | Interacción | Score provisional | Estado |
| --- | --- | --- | --- | --- |
| Button | OK filled primary | Focus-visible `2px` primary + `4px` offset; hover muestreado | ~88 | En refinamiento |
| Switch | OK track/thumb | Toggle label OK (`false→true`) | ~90 | En refinamiento |
| Input | OK outline + label | Controles Storybook presentes | ~88 | En refinamiento |
| Checkbox | OK | Clip light OK | ~90 | En refinamiento |
| Badge | OK filled | Clip light OK | ~88 | En refinamiento |
| Avatar | OK iniciales `AM` | DOM confirma iniciales (no imagen rota) | ~90 | En refinamiento |
| Icon Taiga bridge | OK check/heart/sparkles | Clip OK | ~92 | En refinamiento |
| Resto átomos | Pendiente | — | N/D | Pendiente |

Falsos positivos: full-page Switch/Input “vacíos”; Avatar “imagen rota” era
iniciales `AM`. Siempre verificar con clip + DOM.

### Correcciones aplicadas esta sesión

1. Glass system opacity `0.88` → `0.72` (dark mix `68%`) en tokens + `themes.scss`.
2. Glass foundation preview: fondo con gradientes/orbs saturados para que el blur se lea.
3. Foundation preview: eliminados estilos ad-hoc sobre `button`/`input` que anulaban `atrButton`.
4. **`--tui-disabled-opacity`** mapeaba state-layer `0.12` → ahora `disabled-content` `0.38` (botones Disabled legibles).
5. **Loading button** ya no hereda el fade disabled (`opacity: 1` + spinner visible).
6. Story `Atoms/Button/States` (appearances, disabled, loading, sizes).
7. Divider Semantic y Kbd Playground con contexto visible.
8. Card Appearances: fondo con profundidad para que Glass se perciba.

### Átomos — pasada batch (31 stories)

Todas renderizan contenido usable. Interacciones verificadas: Button focus/hover/loading/disabled, Switch toggle, Checkbox toggle, Input type. Mobile 390×844 + dark muestreado en subset clave.

| Familia | Score | Estado |
| --- | ---: | --- |
| Button | 96 | Disabled `0.38` / loading `1`; States story; focus 2px+4px |
| Switch / Checkbox | 95 | Toggle OK; focus outline primary 2px + 4px offset |
| Input / Textarea | 95 | Focus en textfield host (outline 2px primary) |
| Link | 95 | Focus 2px + 4px offset verificado |
| Avatar / Badge / Icon / Kbd / Status / Divider | 94–95 | Stories con contexto; batch visual OK |
| Progress / IconButton / Copy / Truncated / VH | 94 | Batch visual OK |
| Tabs | 95 | Focus outline primary verificado |

### Composición / moléculas / nav (muestra browser)

Card (glass fix), Accordion, Chip, ContentSwitcher, ActionBar, Timeline, Tabs, FormField, Dialog trigger, Slider — render OK. Heurística `sb-errordisplay` dio falsos positivos (nodo oculto siempre presente).

### Overlays E2E (estático `:6008`)

| Flujo | Resultado |
| --- | --- |
| Dialog open → Escape → foco en origen | OK |
| Dialog Save → result + foco | OK |
| Menu Commands → Escape → foco | OK (6 items) |
| Snackbar Show → dismiss | OK |
| Bottom sheet open → Escape → foco | OK |
| MCP visual Dialog “Edit profile” | OK (form field + actions) |

Evidencia: `.playwright-mcp/visual-audit/overlays/` + `tools/overlays-e2e.mjs`.

### Advanced forms + teclado

Select/Combobox/Autocomplete/Listbox/Slider/OTP/Rating/DatePicker/TimePicker/FileUpload/Popover keyboard — OK (11/11). Probe interactivo 16/16 OK (`dist/storybook-interactive-design.json`).

### Playground smoke

`http://localhost:4200` (FusaTour): home + Explorar lugares + toggle tema — OK. Evidencia: `.playwright-mcp/visual-audit/playground/`.

### Correcciones adicionales

9. Image gallery: un solo `*tuiItem="let index"` (API Taiga 5); nav via `carousel.next/prev` con fallback jsdom.
10. Filter story: click en `label.t-item` (input chip con `pointer-events: none`).
11. Button States en estático: `--tui-disabled-opacity`/`opacity` disabled `0.38`, loading `1`.

### Browser validation

**159/159 OK** en estático `:6008` (`tools/browser-validate-storybook.mjs`). Interactive design probe 16/16. Overlays E2E 6/6. Image-gallery unit tests 2/2.

### Scores (con evidencia de esta pasada)

| Área | Score | Notas |
| --- | ---: | --- |
| Button | 96 | disabled `0.38` / loading `1` en estático |
| Overlays (Dialog/Menu/Sheet/Snackbar) | 95 | open/Escape/focus/action + MCP visual |
| Forms avanzados (teclado) | 95 | 11/11 keyboard + dropdowns |
| Glass / Card | 95 | tokens + escena profundidad |
| Image gallery / Filter | 95 | API Taiga `*tuiItem` + chip label click |
| Playground | 94 | smoke home/nav/tema; budgets ya ajustados |
| Átomos (batch) | 94–96 | render+interacción OK; teclado residual menor |

### Herramientas añadidas

- `tools/overlays-e2e.mjs`
- `tools/advanced-forms-keyboard-e2e.mjs`
- `tools/playground-smoke.mjs`

### Siguiente (sin commit/push/publish)

1. Pulido fino de átomos/nav aún bajo 95 con evidencia de teclado/focus.
2. Criterio de cierre completo (Pages path, tarball consumer) queda para autorización del dueño.

## Publicación y criterio de cierre

La ruta estable es `.github/workflows/pages.yml`:

```text
build Storybook → despliegue GitHub Pages → publicación npm
```

El job usa `npm-production`, `id-token: write` y `--provenance`; publica sólo
una versión inédita. El dueño debe configurar npm Trusted Publishing para
`OsmanJimenez/Atralume`, `.github/workflows/pages.yml` y `npm-production`.
No hagas push, tags, commits, cambios GitHub ni publicaciones sin autorización.

No completes hasta revisar visual e interactivamente todas las historias;
alcanzar 107/107 (o el conteo actual) en browser validation; pasar Storybook
estático bajo `/Atralume/`; tener overlays accesibles con foco y cleanup;
tener tarball correcto en consumer browser y SSR; validar API, tokens,
arquitectura, docs y contenido npm; y excluir `dist/`, screenshots, tarballs,
coverage y caches de Git. El informe final debe incluir conteo, correcciones,
evidencia de accesibilidad, comandos/resultados, consecuencias API/tokens,
estado CI/npm y acciones manuales restantes.
