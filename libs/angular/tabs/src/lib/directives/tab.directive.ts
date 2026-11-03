import {
  Directive,
  input,
  booleanAttribute,
  inject,
  ElementRef,
} from "@angular/core";
import { TuiTab } from "@taiga-ui/kit";
import { TAB_CONTEXT } from "../models/tabs.types";

/** Adapter over Taiga UI `TuiTab`; Atralume owns id/panel selection state. */
@Directive({
  selector: "button[atrTab]",
  standalone: true,
  hostDirectives: [TuiTab],
  host: {
    class: "atr-tab",
    role: "tab",
    "[attr.tuiTab]": '""',
    "[attr.id]": "id()",
    "[attr.aria-controls]": "panel()",
    "[attr.aria-selected]": "owner.activeId() === id()",
    "[attr.tabindex]":
      "(owner.focusId() || owner.activeId()) === id() ? 0 : -1",
    "[attr.disabled]": 'disabled() ? "" : null',
    "[attr.aria-disabled]": 'disabled() ? "true" : null',
    "(click)": "activate()",
  },
})
export class AtralumeTab {
  readonly id = input.required<string>();
  readonly panel = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  protected readonly owner = inject(TAB_CONTEXT);
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  activate(): void {
    if (!this.disabled()) this.owner.activate(this.id());
  }
  focus(): void {
    this.element.nativeElement.focus();
  }
  belongsTo(owner: unknown): boolean {
    return this.owner === owner;
  }
}
