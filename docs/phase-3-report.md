# Atralume — Fase 3

Fecha: 31 de octubre de 2026. Implementación local sobre el trabajo existente, sin operaciones de publicación ni cambios de historial de Git.

## Alcance

Se incorporaron 17 entradas públicas al paquete `@atralume/angular`:

- 3A: Card, Chip/ChipSet, List, Accordion y Skeleton.
- 3B: Tooltip, Menu, Dialog, BottomSheet y Snackbar.
- 3C: Tabs, Breadcrumbs, Pagination, NavigationBar, SideNavigation, FAB y SpeedDial.

Las entradas incluyen exportaciones, contratos tipados, harnesses, ejemplos Storybook y documentación MDX. Los componentes usan señales, OnPush y plantillas y estilos externos. Las directivas conservan los elementos nativos correspondientes. Los estilos y tokens se distribuyen mediante el CSS público del paquete.

La infraestructura compartida de overlays usa CDK internamente. Coordina contexto de tema, superficie, densidad, dirección, overrides públicos, capas, Escape, cierre y destrucción. Dialog y BottomSheet exponen referencias y resultados tipados; Snackbar distingue acción, cierre y expiración. Los overlays abiertos durante SSR devuelven referencias cerradas sin acceder a APIs del navegador.

El playground y la introducción del catálogo incluyen una composición de aplicación con navegación, tarjetas, formularios existentes, estados de carga, acciones y overlays.

## Reutilización

La revisión de composición sustituyó implementaciones duplicadas por los átomos existentes:

- Chip usa Button, IconButton e Icon.
- Pagination usa Button sobre botones y enlaces.
- Snackbar usa Button, IconButton e Icon.
- Accordion y Avatar usan Icon.
- Button usa ProgressSpinner durante la carga.
- SpeedDial usa FAB.
- Card y los overlays proyectan acciones; sus ejemplos importan y usan Button explícitamente.

Se ajustaron las consultas `ElementRef` y los orígenes de eventos para conservar el foco al introducir componentes sobre controles nativos. Las pruebas de Card, Chip y Pagination comprueban la composición además de la interacción. Véase [composición de componentes](component-composition.md).

## Verificación

Los registros de ejecución se conservan localmente bajo `dist/phase3-*.log`. Las comprobaciones cubren pruebas unitarias de librería y playground, lint, estilos, arquitectura sin ciclos, documentación API, compilación de librería y playground, Storybook, historias con interacciones y axe, contextos de overlays y consumo del paquete empaquetado.

La comprobación de arquitectura inspeccionó 195 archivos TypeScript de ejecución. La documentación API se contrasta con inputs, models, outputs y tipos exportados mediante `tools/component-docs.mjs`. `tools/check-phase3.mjs` ejecuta 159 historias de la fase; los recorridos previos de átomos y formularios siguen separados para detectar regresiones.

Resultados comprobados:

| Comprobación                                      | Resultado                                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Unitarias de librería y playground                | Correctas en ambos proyectos, sin caché                                                                         |
| Lint y Stylelint                                  | Correctos                                                                                                       |
| Arquitectura y documentación API                  | Correctas                                                                                                       |
| Compilaciones de librería, playground y Storybook | Correctas                                                                                                       |
| Historias con interacciones y axe                 | 159 de fase 3, 122 de átomos y 74 de formularios correctas                                                      |
| Contextos de átomos                               | 9 contratos light/dark, overrides, Docs, RTL, objetivos táctiles, forced colors y movimiento reducido correctos |
| Temas y Storybook bajo `/Atralume/`               | Correctos                                                                                                       |
| Paquete `.tgz` en consumidor externo              | Compilación de producción, interacción, tipos, estilos, iconos y tree shaking correctos                         |
| SSR del paquete                                   | Todas las familias se renderizan sin globals de navegador                                                       |

El recorrido adicional de contextos detectó y motivó una corrección de especificidad en Skeleton para respetar movimiento reducido. La repetición pasó: 59 Docs, foco, backdrop, bloqueo de scroll, Escape anidado, temas, glass, forced colors, navegación móvil, movimiento reducido y zoom. Los overlays anidados cierran primero la capa superior con Escape y conservan el diálogo subyacente.

## Límites de la verificación

Las comprobaciones automatizadas de teclado, DOM, estilos, axe y SSR no sustituyen una sesión manual con lector de pantalla. No se ha realizado una auditoría con dispositivos de asistencia físicos ni una validación específica de hidratación. Los colores personalizados por consumidores requieren verificar de nuevo su contraste en la aplicación final.
