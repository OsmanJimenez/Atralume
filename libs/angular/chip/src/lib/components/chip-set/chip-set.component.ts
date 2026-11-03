import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  booleanAttribute,
  inject,
  ElementRef,
  contentChildren,
  forwardRef,
} from "@angular/core";
import { AtralumeChip } from "../chip/chip.component";
import { CHIP_SET } from "../../models/chip.types";

/** Composition around Taiga-backed `AtralumeChip`; no Taiga chip-group primitive. */
@Component({
  selector: "atr-chip-set",
  standalone: true,
  templateUrl: "./chip-set.component.html",
  styleUrl: "./chip-set.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: CHIP_SET, useExisting: forwardRef(() => AtralumeChipSet) },
  ],
  host: {
    class: "atr-chip-set",
    role: "group",
    "[attr.aria-label]": "label()",
    "[attr.data-orientation]": "orientation()",
    "(keydown)": "onKey($event)",
  },
})
export class AtralumeChipSet {
  readonly label = input.required<string>();
  readonly selection = input<"single" | "multiple">("multiple");
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly selectionChange = output<readonly string[]>();
  private readonly chips = contentChildren(AtralumeChip);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  choose(value: string, selected: boolean): void {
    if (this.selection() === "single" && selected)
      for (const chip of this.chips())
        if (chip.value() !== value) chip.selected.set(false);
    this.selectionChange.emit(
      this.chips()
        .filter((chip) => chip.selected())
        .map((chip) => chip.value()),
    );
  }
  protected onKey(event: KeyboardEvent): void {
    const available = this.chips().filter((chip) => !chip.disabled());
    const active = available.findIndex(
      (chip) =>
        chip.value() ===
        (event.target as HTMLElement)
          .closest("atr-chip")
          ?.getAttribute("data-value"),
    );
    if (!available.length) return;
    const vertical = this.orientation() === "vertical",
      rtl = this.element.nativeElement.matches(":dir(rtl)");
    let index = active;
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = available.length - 1;
    else if (
      event.key === (vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight")
    )
      index = (active + 1) % available.length;
    else if (
      event.key === (vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft")
    )
      index = (active - 1 + available.length) % available.length;
    else return;
    event.preventDefault();
    available[index].focus();
  }
}
