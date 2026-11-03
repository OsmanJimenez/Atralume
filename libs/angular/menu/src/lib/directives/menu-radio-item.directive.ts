import { Directive } from "@angular/core";
import { CdkMenuItemRadio } from "@angular/cdk/menu";
import { TuiOption } from "@taiga-ui/core";

/**
 * CDK Menu radio item with Taiga UI `TuiOption` appearance adapter.
 */
@Directive({
  selector: "button[atrMenuRadioItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemRadio,
      inputs: ["cdkMenuItemDisabled:disabled", "cdkMenuItemChecked:checked"],
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
export class AtralumeMenuRadioItem {}
