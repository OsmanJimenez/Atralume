import { Directive } from "@angular/core";

@Directive({
  selector: "[atrBottomSheetTitle]",
  standalone: true,
  host: { class: "atr-bottom-sheet-title" },
})
export class AtralumeBottomSheetTitle {}
