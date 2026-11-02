import { Directive } from "@angular/core";
import { CdkMenuGroup } from "@angular/cdk/menu";
@Directive({
  selector: "[atrMenuGroup]",
  standalone: true,
  hostDirectives: [CdkMenuGroup],
  host: { class: "atr-menu-group" },
})
export class AtralumeMenuGroup {}
