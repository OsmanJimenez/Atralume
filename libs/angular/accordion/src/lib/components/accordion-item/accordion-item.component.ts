import {
  AtralumeIcon,
  provideAtralumeIcons,
  chevronDownIcon,
} from "@atralume/angular/icon";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  booleanAttribute,
  inject,
  ElementRef,
  viewChild,
} from "@angular/core";
import { ACCORDION } from "../../models/accordion.types";
@Component({
  selector: "atr-accordion-item",
  standalone: true,
  imports: [AtralumeIcon],
  providers: [provideAtralumeIcons([chevronDownIcon])],

  templateUrl: "./accordion-item.component.html",
  styleUrl: "./accordion-item.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-accordion-item",
    "[attr.data-id]": "id()",
    "[attr.data-expanded]": "expanded()",
  },
})
export class AtralumeAccordionItem {
  readonly id = input.required<string>();
  readonly expanded = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  private readonly owner = inject(ACCORDION, { optional: true });
  private readonly header =
    viewChild.required<ElementRef<HTMLButtonElement>>("header");
  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    if (next) this.owner?.choose(this.id());
    this.expanded.set(next);
  }
  focus(): void {
    this.header().nativeElement.focus();
  }
}
