import { Directive } from "@angular/core";

@Directive({
  selector: "[atrDialogContent]",
  standalone: true,
  host: { class: "atr-dialog-content" },
})
export class AtralumeDialogContent {}
