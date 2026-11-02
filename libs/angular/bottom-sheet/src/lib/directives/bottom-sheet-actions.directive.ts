import { Directive } from "@angular/core";

@Directive({
  selector: "[atrBottomSheetActions]",
  standalone: true,
  host: { class: "atr-bottom-sheet-actions" },
})
export class AtralumeBottomSheetActions {}
