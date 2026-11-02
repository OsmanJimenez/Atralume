import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from "@angular/core";
import { ɵAtralumeControlIds } from "@atralume/angular";
import { LISTBOX_CONTEXT } from "../../models/listbox.types";
@Component({
  selector: "atr-option",
  standalone: true,
  templateUrl: "./option.component.html",
  styleUrl: "./option.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-option",
    role: "option",
    "[id]": "id()",
    "[attr.aria-label]": "label()",
    "[attr.aria-selected]": "selected()",
    "[attr.aria-disabled]": "blocked()",
    "[attr.tabindex]": "tabIndex()",
    "[class.atr-option--active]": "active()",
    "(click)": "choose()",
    "(focus)": "activate()",
    "(mousedown)": "preserveFocus($event)",
  },
})
export class AtralumeOption<T> {
  readonly value = input.required<T>();
  readonly label = input.required<string>();
  readonly id = input<string>(inject(ɵAtralumeControlIds).create());
  readonly disabled = input(false, { transform: booleanAttribute });
  private readonly owner = inject(LISTBOX_CONTEXT);
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly blocked = computed(() => this.disabled() || this.owner.disabled());
  readonly selected = computed(() => this.owner.selected(this.value()));
  readonly active = computed(() => this.owner.activeId() === this.id());
  readonly tabIndex = computed(() =>
    this.owner.focusMode() === "roving" && !this.blocked() && this.active()
      ? 0
      : -1,
  );
  choose(): void {
    if (!this.blocked()) {
      this.activate();
      this.owner.choose(this.value());
    }
  }
  activate(): void {
    if (!this.blocked()) this.owner.activateId(this.id());
  }
  focus(): void {
    this.element.focus();
  }
  belongsTo(owner: unknown): boolean {
    return this.owner === owner;
  }
  protected preserveFocus(event: MouseEvent): void {
    if (this.owner.focusMode() === "activedescendant") event.preventDefault();
  }
}
