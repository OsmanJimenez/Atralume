import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { TuiTree } from "@taiga-ui/kit";

export interface AtralumeTreeNode<T> {
  readonly value: T;
  readonly label: string;
  readonly children?: readonly AtralumeTreeNode<T>[];
  readonly disabled?: boolean;
  readonly loading?: boolean;
}

/**
 * Thin recipe over Taiga `tui-tree` (`TuiTree`).
 * Blockers vs full parity: Taiga expansion is controller/map-based (not value[] models);
 * multi-select / aria-multiselectable and loading placeholders stay Atralume-side.
 * This pass shows `tui-tree` in the DOM and maps `AtralumeTreeNode` via `childrenHandler`.
 */
@Component({
  selector: "atr-tree",
  standalone: true,
  imports: [TuiTree],
  templateUrl: "./tree.component.html",
  styleUrl: "./tree.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-tree" },
})
export class AtralumeTree<T> {
  readonly label = input("Tree");
  readonly nodes = input<readonly AtralumeTreeNode<T>[]>([]);
  readonly selectionMode = input<"single" | "multiple">("single");
  readonly selected = model<readonly T[]>([]);
  readonly expanded = model<readonly T[]>([]);
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly selectionChange = output<readonly T[]>();
  readonly expansionChange = output<readonly T[]>();
  /** Prefer Taiga map controller; when true all nodes start expanded. */
  readonly expandAll = input(true, { transform: booleanAttribute });

  protected readonly content = viewChild.required<TemplateRef<unknown>>("node");

  protected readonly childrenOf = (
    item: AtralumeTreeNode<T> | readonly AtralumeTreeNode<T>[],
  ): readonly AtralumeTreeNode<T>[] => {
    if (!this.isNode(item)) return item;
    return item.children ?? [];
  };

  protected isNode(
    item: AtralumeTreeNode<T> | readonly AtralumeTreeNode<T>[],
  ): item is AtralumeTreeNode<T> {
    return !Array.isArray(item) && typeof item === "object" && item !== null;
  }

  protected isSelected(node: AtralumeTreeNode<T>): boolean {
    return this.selected().some((value) => this.compareWith()(node.value, value));
  }

  protected select(node: AtralumeTreeNode<T>, event: Event): void {
    event.stopPropagation();
    if (node.disabled) return;
    const exists = this.isSelected(node);
    const selected =
      this.selectionMode() === "single"
        ? exists
          ? []
          : [node.value]
        : exists
          ? this.selected().filter((value) => !this.compareWith()(value, node.value))
          : [...this.selected(), node.value];
    this.selected.set(selected);
    this.selectionChange.emit(selected);
  }

}
