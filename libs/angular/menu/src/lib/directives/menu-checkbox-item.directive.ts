import { Directive } from "@angular/core";
import { CdkMenuItemCheckbox } from "@angular/cdk/menu";
@Directive({
  selector: "button[atrMenuCheckboxItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
      inputs: ["cdkMenuItemDisabled:disabled", "cdkMenuItemChecked:checked"],
      outputs: ["cdkMenuItemTriggered:invoked"],
    },
  ],
  host: { class: "atr-menu-item" },
})
export class AtralumeMenuCheckboxItem {}
