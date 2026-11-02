import { Directive } from "@angular/core";

@Directive({
  selector: "[atrBottomSheetContent]",
  standalone: true,
  host: { class: "atr-bottom-sheet-content" },
})
export class AtralumeBottomSheetContent {}
