import { Directive } from "@angular/core";
import { CdkMenuItemCheckbox } from "@angular/cdk/menu";
import { TuiOption } from "@taiga-ui/core";

/**
 * CDK Menu checkbox item with Taiga UI `TuiOption` appearance adapter.
 */
@Directive({
  selector: "button[atrMenuCheckboxItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
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
export class AtralumeMenuCheckboxItem {}
