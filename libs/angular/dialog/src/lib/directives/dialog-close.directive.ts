import { Directive, input, inject } from "@angular/core";
import { AtralumeDialogRef } from "../services/dialog.service";
@Directive({
  selector: "button[atrDialogClose]",
  standalone: true,
  host: { "(click)": "close()" },
})
export class AtralumeDialogClose<R = unknown> {
  readonly atrDialogClose = input<R>();
  private readonly ref = inject(AtralumeDialogRef<R>);
  close(): void {
    this.ref.close(this.atrDialogClose());
  }
}
