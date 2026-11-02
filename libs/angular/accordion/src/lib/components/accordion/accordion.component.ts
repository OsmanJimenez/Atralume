import {
  ChangeDetectionStrategy,
  Component,
  input,
  booleanAttribute,
  contentChildren,
  forwardRef,
} from "@angular/core";
import { AtralumeAccordionItem } from "../accordion-item/accordion-item.component";
import { ACCORDION } from "../../models/accordion.types";
@Component({
  selector: "atr-accordion",
  standalone: true,
  templateUrl: "./accordion.component.html",
  styleUrl: "./accordion.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: ACCORDION, useExisting: forwardRef(() => AtralumeAccordion) },
  ],
  host: { class: "atr-accordion", "(keydown)": "onKey($event)" },
})
export class AtralumeAccordion {
  readonly multi = input(false, { transform: booleanAttribute });
  private readonly items = contentChildren(AtralumeAccordionItem);
  choose(id: string): void {
    if (!this.multi())
      for (const item of this.items())
        if (item.id() !== id) item.expanded.set(false);
  }
  protected onKey(event: KeyboardEvent): void {
    const items = this.items().filter((item) => !item.disabled());
    const index = items.findIndex(
      (item) =>
        event.target instanceof HTMLElement &&
        event.target.id === item.id() + "-header",
    );
    if (index < 0) return;
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[next].focus();
  }
}
