import { Directive } from "@angular/core";

@Directive({
  selector: "[atrDialogTitle]",
  standalone: true,
  host: { class: "atr-dialog-title" },
})
export class AtralumeDialogTitle {}
