# Composición de componentes

Los componentes compuestos reutilizan los átomos públicos cuando necesitan el mismo control, estado y comportamiento. Los contenedores con contenido proyectado dejan esa composición explícita en la plantilla del consumidor.

| Componente | Composición                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Card       | Proyecta Header, Media, Content y Actions. Sus ejemplos componen Avatar y Button.                    |
| Chip       | Button para la acción principal; IconButton e Icon para eliminar. ChipSet coordina selección y foco. |
| Pagination | Button sobre botones y enlaces, conservando enlaces navegables y la página actual.                   |
| Snackbar   | Button para la acción e IconButton con Icon para cerrar.                                             |
| Accordion  | Icon para el indicador; su encabezado conserva el control específico de expansión.                   |
| Avatar     | Icon para el contenido alternativo sin imagen ni iniciales.                                          |
| Button     | ProgressSpinner para el estado de carga.                                                             |
| SpeedDial  | FAB para el disparador y acciones proyectadas con navegación propia.                                 |

## Card con acciones

```ts
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
} from "@atralume/angular/card";
import { AtralumeButton } from "@atralume/angular/button";
```

Incluye estas clases en `imports` del componente consumidor:

```html
<atr-card>
  <header atrCardHeader><h2>Cuenta</h2></header>
  <div atrCardContent>Administra tu perfil.</div>
  <footer atrCardActions>
    <button atrButton appearance="text" type="button">Cancelar</button>
    <button atrButton type="button">Guardar</button>
  </footer>
</atr-card>
```

La proyección no agrega directivas a sus descendientes. Un botón dentro de `atrCardActions` necesita `atrButton` y su importación para recibir el comportamiento y los estilos del átomo.

Los controles especializados de Menu, Tabs y Accordion conservan sus roles, selección y manejo del teclado. Los átomos se reutilizan cuando sus contratos corresponden al control. Las dependencias entre entradas pasan por sus exportaciones públicas; la comprobación de arquitectura detecta ciclos.

Al agregar `atrButton` a un elemento, una referencia de plantilla puede resolver al componente Button. Para obtener el elemento de origen de un overlay desde un evento, usa `event.currentTarget`; para consultas de vista, usa `read: ElementRef`. Esto conserva la restauración del foco.
