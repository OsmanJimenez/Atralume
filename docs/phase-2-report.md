# Atralume — Fase 2

Fecha: 31 de octubre de 2026. Implementación local; sin commits, push, PR, merge, cambios de rama ni despliegue.

## Auditoría inicial

- No existe `AGENTS.md` en la raíz del workspace.
- Angular 22.2.1, Nx 23.2.1 y Storybook 10.6.1; prefijo real `atr`, clases `Atralume*` y un paquete npm con secondary entrypoints.
- Button era un componente standalone sobre `button[atrButton]`, con tokens, dos pruebas y documentación duplicada mediante autodocs y un MDX `Documentation`. No tenía variantes, loading ni harness.
- Faltaban los otros ocho átomos. Forms ya estaba presente como trabajo local previo y se conservó.
- Línea base: `npm run test:unit -- --skip-nx-cache --output-style=static`: **18 pruebas de librería y 1 del playground**, todas correctas.
- Se inspeccionaron `npx nx show projects`, `npx nx show project angular`, los entrypoints, Forms, tokens, estilos, stories, MDX y herramientas de empaquetado.

## Implementado

Button conserva su nombre, selector, comportamiento nativo y apariencia predeterminada. Añade anchors, cuatro appearances, tres tamaños, loading, fullWidth, iconos proyectados y harness. Loading conserva el nombre y el ancho, anuncia `aria-busy` y bloquea activación; al finalizar respeta disabled explícito.

Nuevos componentes: Icon, Badge, Avatar, Progress Spinner y Progress Bar. Nuevas directivas: Icon Button, Link y Divider. Los componentes públicos mantienen HTML y SCSS independientes, standalone, OnPush y signal inputs. Las directivas conservan botones, anchors y separadores nativos.

Cada átomo incluye pruebas, stories, una página MDX `Docs`, harness y exportaciones públicas. Los examples cubren light, dark, system, temas anidados, superficies standard/elevated/transparent/glass y overrides. Se añadieron tonos semánticos success, warning e info con pares de contraste comprobados en ambos temas.

La landing existente incorpora enlaces y composiciones light/dark/glass. El playground mantiene el formulario y añade acciones con iconos, identidad, badges, navegación, separadores y una simulación de progreso controlada por el usuario, sin temporizadores.

## Decisiones técnicas

- **Iconos:** definiciones estructuradas de paths, registro por injector y fallback al registro padre. No HTTP, fuentes externas, SVG remoto, HTML dinámico ni bypass de sanitización. Se validan los paths registrados. Solo los iconos direccionales marcados se reflejan en RTL. Los iconos informativos requieren label; los decorativos se ocultan de accesibilidad.
- **Personalización:** se reutiliza la cadena `atr.ref` → `atr.sys` → `atr.comp`. Los consumidores sobrescriben `--atr-comp-*` mediante CSS. Las variantes funcionales usan inputs tipados; los detalles de marca usan tokens.
- **Temas y glass:** se conserva la infraestructura existente. System vuelve a enlazar los tokens en su ámbito, incluso dentro de otro tema. Los átomos no aplican backdrop-filter propio; glass mantiene el fallback opaco y el tratamiento de forced colors.
- **Avatar:** imagen, iniciales explícitas, iniciales derivadas y SVG genérico, con error de imagen sin bucle. La regla de iniciales está documentada para nombres con varios segmentos y Unicode.
- **Progress:** `null` es indeterminado. Los valores finitos se limitan visualmente al rango, con diagnóstico en desarrollo; rangos inválidos y valores no finitos se rechazan. Reduced motion sustituye traslación/rotación por un pulso de opacidad.
- **Documentación:** MDX manual es la única documentación editorial de cada átomo. `tools/atom-docs.mjs` extrae inputs y variantes directamente del AST de TypeScript y comprueba que las tablas públicas estén sincronizadas. No depende de duplicar manualmente los contratos.
- **Compatibilidad:** Forms conserva su lógica y API. Solo recibió formato y la corrección de una story dark que carecía de una superficie adecuada. Foundations, Nx, workflows y Pages permanecen vigentes.

## API pública

Todos los entrypoints usan el prefijo `@atralume/angular/`:

| Entrypoint    | Exportaciones principales                                                                                         | Harness                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `button`      | `AtralumeButton`, `ButtonAppearance`, `ButtonSize`                                                                | `AtralumeButtonHarness`                                        |
| `icon`        | `AtralumeIcon`, `IconSize`, `AtralumeIconDefinition`, `AtralumeIconRegistry`, `ATR_ICONS`, `provideAtralumeIcons` | `AtralumeIconHarness`                                          |
| `icon-button` | `AtralumeIconButton`, `IconButtonAppearance`, `IconButtonSize`                                                    | `AtralumeIconButtonHarness`                                    |
| `link`        | `AtralumeLink`, `LinkAppearance`, `LinkUnderline`                                                                 | `AtralumeLinkHarness`                                          |
| `badge`       | `AtralumeBadge`, `BadgeAppearance`, `BadgeTone`, `BadgeSize`                                                      | `AtralumeBadgeHarness`                                         |
| `avatar`      | `AtralumeAvatar`, `AvatarSize`, `AvatarShape`                                                                     | `AtralumeAvatarHarness`                                        |
| `divider`     | `AtralumeDivider`, `DividerOrientation`, `DividerInset`                                                           | `AtralumeDividerHarness`                                       |
| `progress`    | `AtralumeProgressSpinner`, `ProgressSpinnerSize`, `AtralumeProgressBar`                                           | `AtralumeProgressSpinnerHarness`, `AtralumeProgressBarHarness` |

Icon exporta individualmente `checkIcon`, `closeIcon`, `arrowRightIcon`, `chevronDownIcon`, `infoIcon`, `warningIcon`, `userIcon` y `menuIcon`. El consumidor registra únicamente los que necesita.

Estilos públicos conservados: `@atralume/angular/styles/theme.css` y el entrypoint Sass `@atralume/angular/styles`. El stylesheet incluye las directivas. El manifiesto está disponible en `@atralume/angular/styles/tokens.json`.

## Storybook

La jerarquía canónica es `Atoms/Button`, `Icon`, `Icon Button`, `Link`, `Badge`, `Avatar`, `Divider`, `Progress Spinner` y `Progress Bar`. Cada uno tiene exactamente una página `Docs`. La muestra editorial está en `Atralume/Atoms` y se incorpora a la Introduction existente.

Se eliminaron la duplicación de Button y las rutas documentales físicas; Forms conserva su contenido y navegación bajo Forms. El verificador comprueba el índice y renderiza las nueve páginas editoriales. Las 122 stories de átomos y la muestra de landing pasaron las funciones play y axe. Además se comprobaron nueve contratos light/dark y overrides, temas anidados, RTL, target de 48 px, foco por teclado, forced colors, reduced motion y reflow al 200%. Se inspeccionaron capturas light y dark.

## Verificación

| Comando exacto                                               | Resultado                                                                                     |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `npm run format:check`                                       | Correcto, workspace completo                                                                  |
| `npm run lint`                                               | Correcto, Angular y playground                                                                |
| `npm run lint:styles`                                        | Correcto                                                                                      |
| `npm run check:architecture`                                 | Correcto: 37 archivos runtime y 3 fixtures de política                                        |
| `npm run check:atom-docs`                                    | Correcto: nueve contratos documentales sincronizados                                          |
| `npm run tokens:check`                                       | Correcto: aliases, paridad, determinismo y contraste de colores semánticos                    |
| `npm run tokens:build`                                       | Correcto                                                                                      |
| `npm run test:unit -- --skip-nx-cache --output-style=static` | Correcto: 45 pruebas de librería y 1 del playground                                           |
| `npm run build`                                              | Correcto: compilación Angular estricta y paquete con todos los entrypoints                    |
| `npm run build:playground`                                   | Correcto: producción, sin warnings de presupuesto de componentes                              |
| `npm run build:storybook`                                    | Correcto, configuración CI                                                                    |
| `npm run test:themes`                                        | Correcto: light/dark/system, temas anidados, overrides, glass, forced colors y reduced motion |
| `npm run check:package`                                      | Correcto: instalación externa, build de producción, runtime, typings, tree shaking y SSR      |
| `npm run check:storybook`                                    | Correcto bajo `/Atralume/`                                                                    |
| `npm run test:atoms`                                         | Correcto: 122 stories con interacción y axe; nueve Docs y contextos adicionales               |
| `npm run test:forms`                                         | Correcto: 74 stories, interacción y axe                                                       |
| `npm run verify`                                             | Correcto: exit code 0                                                                         |

No existe un target separado de typecheck; la compilación de la librería y las aplicaciones verifica TypeScript y templates Angular. Los tests de navegador ejecutan las funciones play y axe con WCAG 2/2.1/2.2 AA, sin desactivar reglas globales.

El target de tests ahora descubre también los specs junto a los secondary entrypoints. `format:check` usa `--all` para funcionar sin asumir que exista una rama local llamada main. `verify` incluye las comprobaciones de documentación, átomos y Forms.

## Empaquetado

Tarball: `dist/libs/angular/atralume-angular-0.0.0.tgz`.

El checker instala el tarball fuera del workspace y compila una aplicación Angular de producción. Comprueba todos los entrypoints de átomos, typings empaquetados, CSS público, registro de iconos, comportamiento de Forms y de los átomos en navegador, ausencia de imports internos, ausencia de dependencia de Angular Material/Storybook y eliminación de un icono no utilizado mediante tree shaking.

La aplicación externa final fue `C:/Users/osman/AppData/Local/Temp/atralume-package-check/consumer-Q8sgy2` y compiló en producción. El checker elimina su directorio temporal al terminar y conserva el tarball validado.

También pasó una ejecución real del renderizador de servidor de Angular contra los nueve átomos empaquetados, con `@angular/platform-server` instalado únicamente en el consumidor temporal y el host local explícitamente permitido. Se verificaron markup SVG, labels, loading y ARIA de progreso sin globals de navegador.

## Regresiones y límites

Confirmado: Forms pasa dentro de las 45 pruebas unitarias de la librería y su suite de 74 stories. Foundations conserva sus fuentes y compila con Storybook y el sistema de temas. Button conserva los usos anteriores y los tests originales. Playground compila en producción. Storybook construye con configuración CI y funciona bajo /Atralume/ para GitHub Pages. No se modificaron workflows ni se realizó despliegue. La suite npm run verify terminó con exit code 0. Las capturas están en dist/storybook/angular/atoms-light.png y atoms-dark.png.

No existe un target de hidratación en este workspace; no se ha ejecutado una prueba de hidratación de extremo a extremo. La inspección visual y las pruebas de navegador complementan axe; no se ha realizado una sesión con un lector de pantalla real. Los avisos de tamaño de bundles de Storybook corresponden a su infraestructura de documentación y axe.
