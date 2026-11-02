import { Directive, inject, ElementRef } from "@angular/core";
@Directive({
  selector: "button[atrSpeedDialAction]",
  standalone: true,
  host: { class: "atr-speed-dial-action" },
})
export class AtralumeSpeedDialAction {
  private readonly ref = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  focus(): void {
    this.ref.nativeElement.focus();
  }
  isDisabled(): boolean {
    return this.ref.nativeElement.disabled;
  }
  element(): HTMLButtonElement {
    return this.ref.nativeElement;
  }
}
