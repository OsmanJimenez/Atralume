import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  closeIcon,
} from "@atralume/angular/icon";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  computed,
  booleanAttribute,
  inject,
  ElementRef,
  viewChild,
} from "@angular/core";
import { CHIP_SET, type ChipKind } from "../../models/chip.types";
@Component({
  selector: "atr-chip",
  standalone: true,
  imports: [AtralumeButton, AtralumeIconButton, AtralumeIcon],
  providers: [provideAtralumeIcons([closeIcon])],

  templateUrl: "./chip.component.html",
  styleUrl: "./chip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-chip",
    "[attr.data-selected]": "selected()",
    "[attr.data-value]": "value()",
  },
})
export class AtralumeChip {
  readonly kind = input<ChipKind>("assist");
  readonly value = input("");
  readonly label = input.required<string>();
  readonly selected = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removed = output<string>();
  readonly invoked = output<string>();
  private readonly owner = inject(CHIP_SET, { optional: true });
  protected readonly blocked = computed(
    () => this.disabled() || (this.owner?.disabled() ?? false),
  );
  private readonly button = viewChild.required<
    unknown,
    ElementRef<HTMLButtonElement>
  >("action", { read: ElementRef });
  activate(): void {
    if (this.blocked()) return;
    if (this.kind() === "filter") {
      this.selected.update((value) => !value);
      this.owner?.choose(this.value(), this.selected());
    }
    this.invoked.emit(this.value());
  }
  focus(): void {
    this.button().nativeElement.focus();
  }
  remove(): void {
    if (!this.blocked()) this.removed.emit(this.value());
  }
}
