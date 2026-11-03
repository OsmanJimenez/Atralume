import { Directive } from "@angular/core";
import { CdkMenuItem } from "@angular/cdk/menu";
import { TuiOption } from "@taiga-ui/core";

/**
 * CDK Menu item with Taiga UI `TuiOption` appearance adapter.
 */
@Directive({
  selector: "button[atrMenuItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ["cdkMenuItemDisabled:disabled"],
      outputs: ["cdkMenuItemTriggered:invoked"],
    },
    {
      directive: TuiOption,
      inputs: ["disabled"],
    },
  ],
  host: {
    class: "atr-menu-item",
    "[attr.tuiOption]": '""',
  },
})
export class AtralumeMenuItem {}
