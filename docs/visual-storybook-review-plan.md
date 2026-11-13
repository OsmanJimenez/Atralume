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
