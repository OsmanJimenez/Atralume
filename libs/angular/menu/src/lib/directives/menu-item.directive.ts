import { Directive } from "@angular/core";
import { CdkMenuItem } from "@angular/cdk/menu";
@Directive({
  selector: "button[atrMenuItem]",
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ["cdkMenuItemDisabled:disabled"],
      outputs: ["cdkMenuItemTriggered:invoked"],
    },
  ],
  host: { class: "atr-menu-item" },
})
export class AtralumeMenuItem {}
