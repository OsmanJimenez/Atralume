import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { TuiDataListWrapper } from "@taiga-ui/kit";
import type {
  AtralumeOptionData,
  SelectionMode,
} from "../../models/listbox.types";

/**
 * Thin listbox over Taiga `tui-data-list-wrapper`.
 *
 * Breaking: CDK key manager removed; prefer wrapper `items` API.
 * `selectionMode="multiple"` keeps a local multi model (itemClick toggles).
 */
@Component({
  selector: "atr-listbox",
  standalone: true,
  imports: [TuiDataListWrapper],
  templateUrl: "./listbox.component.html",
  styleUrl: "./listbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-listbox",
    role: "presentation",
  },
})
export class AtralumeListbox<T> {
  readonly label = input.required<string>();
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly value = model<readonly T[]>([]);
  readonly selectionMode = input<SelectionMode>("single");
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly emptyText = input("No results");
  readonly chosen = output<T>();

  readonly items = computed(() => this.options().map((option) => option.value));

  protected pick(value: T): void {
    if (this.disabled()) return;
    const option = this.options().find((item) => Object.is(item.value, value));
    if (option?.disabled) return;
    if (this.selectionMode() === "multiple") {
      const current = this.value();
      const next = current.some((item) => Object.is(item, value))
        ? current.filter((item) => !Object.is(item, value))
        : [...current, value];
      this.value.set(next);
    } else {
      this.value.set([value]);
    }
    this.chosen.emit(value);
  }
}
