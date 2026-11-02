import { Directive, input, inject } from "@angular/core";
import { AtralumeBottomSheetRef } from "../services/bottom-sheet.service";
@Directive({
  selector: "button[atrBottomSheetClose]",
  standalone: true,
  host: { "(click)": "close()" },
})
export class AtralumeBottomSheetClose<R = unknown> {
  readonly atrBottomSheetClose = input<R>();
  private readonly ref = inject(AtralumeBottomSheetRef<R>);
  close(): void {
    this.ref.close(this.atrBottomSheetClose());
  }
}
