import { Directive } from "@angular/core";
import { CdkMenuItemRadio } from "@angular/cdk/menu";
@Directive({
  selector: "button[atrMenuRadioItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItemRadio,
      inputs: ["cdkMenuItemDisabled:disabled", "cdkMenuItemChecked:checked"],
      outputs: ["cdkMenuItemTriggered:invoked"],
    },
  ],
  host: { class: "atr-menu-item" },
})
export class AtralumeMenuRadioItem {}
