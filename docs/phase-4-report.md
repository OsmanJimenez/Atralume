# Atralume — Fase 4

Estado: en implementación. La fase no se considera terminada hasta validar 4A, 4B y 4C y documentar los criterios pendientes.

## Auditoría inicial

- No se encontró `AGENTS.md` en el workspace ni en sus carpetas superiores.
- Se conservó el trabajo local de las fases anteriores, incluidos los archivos staged y sin seguimiento. Git se utilizó solo para inspeccionar el estado.
- Versiones instaladas: Angular, Angular Aria y CDK 22.2.1; Nx 23.2.1; Storybook 10.6.1.
- `npm run verify` terminó correctamente antes de modificar la implementación. Registro: `dist/phase4-baseline.log`.
- La línea base incluye unitarias, formato, lint, estilos, arquitectura, documentación, tokens, compilaciones, temas, paquete externo, SSR, Storybook y 355 historias con interacciones y axe. También pasó el recorrido de 59 Docs y contextos de fase 3.
- Se revisaron los controles nativos existentes, el contrato de Form Field y la infraestructura compartida de overlays, incluido su manejo de Escape, foco, contexto y destrucción.

## Decisiones de arquitectura

La dependencia de selección sigue `Listbox → Combobox → Select / Autocomplete`. Command Palette compone Dialog y Combobox en línea. Popover usa el mismo motor conectado de overlays. Las acciones reutilizan Button, IconButton e Icon; las selecciones múltiples usan Chip y los estados de carga usan ProgressSpinner.

Listbox utiliza las APIs públicas de CDK `ActiveDescendantKeyManager` y `SelectionModel`. La comparación configurable de valores permite conservar la selección cuando cambian las instancias de objetos. El foco activo permanece separado del valor confirmado.

El puente de controles distingue escrituras externas y confirmaciones del usuario. Integra CVA y el contrato público de Signal Forms mediante `value`, estados de disponibilidad y `touch`. Las declaraciones instaladas marcan `FormValueControl` como API pública desde Angular 22.0. No se exponen tipos privados ni experimentales de Angular en la API de Atralume.

Fuentes de referencia: [controles personalizados de Angular](https://angular.dev/guide/forms/signals/custom-controls), [Angular Aria](https://angular.dev/guide/aria/overview), [patrón Combobox de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) y [patrón Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/). Las APIs efectivamente utilizadas se comprobaron también contra las declaraciones de los paquetes instalados.

## Checkpoint 4A

Implementadas las entradas Listbox, Combobox, Select, Autocomplete, Popover y Command Palette. Cada familia tiene documentación MDX, ejemplos, pruebas y harnesses. Los controles comparten el puente de formularios. Los tests incluyen objetos, selección múltiple y eliminación de chips; tres modalidades de Forms; readonly, disabled, clear, reset, touched, dirty, required; IME; destrucción de overlays y comandos anidados.

La validación de documentación API se amplió sobre la herramienta existente y contempla los miembros heredados del puente de formularios. Se corrigió el escape de saltos de línea CRLF para que los tipos genéricos no rompan las tablas MDX.

La virtualización no está habilitada en estas familias. Las colecciones grandes usan renderizado ordinario; la documentación distingue este límite de una implementación con reciclado de opciones, scroll-to-active y active descendant. No se promete soporte de accesibilidad para opciones virtualizadas sin verificarlo.

## Checkpoint 4B

Pendiente: Calendar y adapter, Date Picker, Time Picker, Slider/Range Slider, File Upload y Stepper.

## Checkpoint 4C

Se añadieron los entry points `@atralume/angular/table`,
`@atralume/angular/tree` y `@atralume/angular/carousel`, cada uno con un
componente standalone, tokens compartidos existentes, documentación MDX,
historias, pruebas unitarias y harness.

- Table conserva la semántica HTML de `table`, y modela independientemente
  selección visible, expansión y la intención de ordenamiento; no hace
  peticiones ni transforma las filas del consumidor.
- Tree guarda selección y expansión fuera de los nodos, comunica la jerarquía
  ARIA y admite navegación con flechas, Home/End, Enter/Espacio y typeahead.
- Carousel no inicia autoplay por defecto; al habilitarlo permite pausa,
  respeta reduced motion y se detiene mientras el documento no es visible.

Las pruebas de librería, arquitectura, lint y estilos pasan. El build estático
de Storybook y la integración visual de estas tres familias en el playground
siguen pendientes de una sesión de validación final.

## Verificación final pendiente

Regresión completa, integración de todas las familias en landing y playground,
consumo externo de los nuevos entrypoints, SSR e hidratación y mediciones de
rendimiento. La comprobación con lector de pantalla se debe registrar como
manual únicamente si se realiza; axe y snapshots de accesibilidad no la
sustituyen.
