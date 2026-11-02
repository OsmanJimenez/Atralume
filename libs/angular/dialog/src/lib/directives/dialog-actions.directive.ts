import { Directive } from "@angular/core";

@Directive({
  selector: "[atrDialogActions]",
  standalone: true,
  host: { class: "atr-dialog-actions" },
})
export class AtralumeDialogActions {}
