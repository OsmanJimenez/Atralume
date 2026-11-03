import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { TuiTable } from "@taiga-ui/addon-table";

export interface AtralumeTableColumn<T> {
  readonly id: string;
  readonly header: string;
  readonly cell: (row: T) => string | number | null | undefined;
  readonly sortable?: boolean;
  readonly sticky?: "start" | "end";
}
export interface AtralumeSort {
  readonly active: string;
  readonly direction: "asc" | "desc" | "";
}
export interface AtralumeTableSelectionChange<T> {
  readonly selected: readonly T[];
  readonly changed: T;
}

/**
 * High-level table composed over `@taiga-ui/addon-table` (`tuiTable` / `tuiTh` / `tuiTd`).
 * Keeps rows/columns/selection/sort/expand contract; cells render via column.cell().
 */
@Component({
  selector: "atr-table",
  standalone: true,
  imports: [TuiTable],
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-table" },
})
export class AtralumeTable<T extends Partial<Record<keyof T, unknown>>> {
  readonly label = input("Data table");
  readonly rows = input<readonly T[]>([]);
  readonly columns = input<readonly AtralumeTableColumn<T>[]>([]);
  readonly trackBy = input<(row: T, index: number) => unknown>((row) => row);
  readonly selectionMode = input<"none" | "single" | "multiple">("none");
  readonly selected = model<readonly T[]>([]);
  readonly expanded = model<readonly T[]>([]);
  readonly sort = model<AtralumeSort>({ active: "", direction: "" });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly error = input<string | null>(null);
  readonly emptyText = input("No rows");
  readonly zebra = input(false, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  readonly expandable = input(false, { transform: booleanAttribute });
  readonly detail = input<(row: T) => string | null>(() => null);
  readonly selectionChange = output<AtralumeTableSelectionChange<T>>();
  readonly expansionChange = output<readonly T[]>();

  readonly columnIds = computed(() => this.columns().map((column) => column.id));
  readonly allSelected = computed(() => {
    const rows = this.rows();
    return rows.length > 0 && rows.every((row, index) => this.isSelected(row, index));
  });
  readonly colspan = computed(
    () =>
      this.columns().length +
      (this.selectionMode() === "none" ? 0 : 1) +
      (this.expandable() ? 1 : 0),
  );

  private same(a: T, b: T, index = 0): boolean {
    return Object.is(this.trackBy()(a, index), this.trackBy()(b, index));
  }
  isSelected(row: T, index: number): boolean {
    return this.selected().some((item) => this.same(item, row, index));
  }
  isExpanded(row: T, index: number): boolean {
    return this.expanded().some((item) => this.same(item, row, index));
  }
  select(row: T, index: number): void {
    if (this.selectionMode() === "none") return;
    const present = this.isSelected(row, index);
    const next =
      this.selectionMode() === "single"
        ? present
          ? []
          : [row]
        : present
          ? this.selected().filter((item) => !this.same(item, row, index))
          : [...this.selected(), row];
    this.selected.set(next);
    this.selectionChange.emit({ selected: next, changed: row });
  }
  selectAll(): void {
    if (this.selectionMode() !== "multiple") return;
    const next = this.allSelected() ? [] : [...this.rows()];
    this.selected.set(next);
    if (this.rows().length)
      this.selectionChange.emit({ selected: next, changed: this.rows()[0] });
  }
  toggleExpanded(row: T, index: number): void {
    if (!this.expandable()) return;
    const next = this.isExpanded(row, index)
      ? this.expanded().filter((item) => !this.same(item, row, index))
      : [...this.expanded(), row];
    this.expanded.set(next);
    this.expansionChange.emit(next);
  }
  requestSort(column: AtralumeTableColumn<T>): void {
    if (!column.sortable) return;
    const current = this.sort();
    const direction: AtralumeSort["direction"] =
      current.active !== column.id
        ? "asc"
        : current.direction === "asc"
          ? "desc"
          : current.direction === "desc"
            ? ""
            : "asc";
    const next = { active: direction ? column.id : "", direction };
    this.sort.set(next);
  }
  sortLabel(column: AtralumeTableColumn<T>): string {
    const sort = this.sort();
    return sort.active === column.id && sort.direction
      ? `Sort ${column.header}: ${sort.direction}`
      : `Sort ${column.header}`;
  }
}
