import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";

export interface AtralumeTreeNode<T> {
  readonly value: T;
  readonly label: string;
  readonly children?: readonly AtralumeTreeNode<T>[];
  readonly disabled?: boolean;
  readonly loading?: boolean;
}
interface VisibleNode<T> { node: AtralumeTreeNode<T>; level: number; parent: AtralumeTreeNode<T> | null; position: number; setSize: number; }

@Component({
  selector: "atr-tree",
  standalone: true,
  templateUrl: "./tree.component.html",
  styleUrl: "./tree.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-tree", "(keydown)": "key($event)" },
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
  private readonly active = signal<T | null>(null);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly visible = computed<readonly VisibleNode<T>[]>(() => {
    const result: VisibleNode<T>[] = [];
    const visit = (nodes: readonly AtralumeTreeNode<T>[], level: number, parent: AtralumeTreeNode<T> | null) => nodes.forEach((node, index) => {
      result.push({ node, level, parent, position: index + 1, setSize: nodes.length });
      if (node.children?.length && this.isExpanded(node)) visit(node.children, level + 1, node);
    });
    visit(this.nodes(), 1, null);
    return result;
  });
  activeId = computed(() => {
    const current = this.active();
    return this.visible().findIndex((item) => current !== null && this.same(item.node.value, current));
  });
  isSelected(node: AtralumeTreeNode<T>): boolean { return this.selected().some(value => this.same(node.value, value)); }
  isExpanded(node: AtralumeTreeNode<T>): boolean { return this.expanded().some(value => this.same(node.value, value)); }
  hasChildren(node: AtralumeTreeNode<T>): boolean { return !!node.children?.length || !!node.loading; }
  nodeId(item: VisibleNode<T>): string { return `atr-tree-node-${this.visible().indexOf(item)}`; }
  select(item: VisibleNode<T>): void {
    if (item.node.disabled) return;
    const exists = this.isSelected(item.node);
    const selected = this.selectionMode() === "single" ? (exists ? [] : [item.node.value]) : (exists ? this.selected().filter(value => !this.same(value, item.node.value)) : [...this.selected(), item.node.value]);
    this.active.set(item.node.value); this.selected.set(selected); this.selectionChange.emit(selected);
  }
  toggle(item: VisibleNode<T>): void {
    if (item.node.disabled || !this.hasChildren(item.node)) return;
    const expanded = this.isExpanded(item.node) ? this.expanded().filter(value => !this.same(value, item.node.value)) : [...this.expanded(), item.node.value];
    this.expanded.set(expanded); this.expansionChange.emit(expanded);
  }
  private same(a: T, b: T): boolean { return this.compareWith()(a, b); }
  private focus(index: number): void {
    const item = this.visible()[index]; if (!item) return;
    this.active.set(item.node.value);
    afterNextRender(() => this.element.querySelector<HTMLElement>(`#${this.nodeId(item)}`)?.focus());
  }
  protected key(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.getAttribute("role") !== "treeitem") return;
    const current = this.visible().findIndex(item => this.nodeId(item) === target.id);
    if (current < 0) return;
    const item = this.visible()[current], rtl = this.element.matches(":dir(rtl)");
    const nextEnabled = (from: number, step: number) => { let index = from + step; while (this.visible()[index]?.node.disabled) index += step; return Math.max(0, Math.min(this.visible().length - 1, index)); };
    switch (event.key) {
      case "ArrowDown": event.preventDefault(); this.focus(nextEnabled(current, 1)); break;
      case "ArrowUp": event.preventDefault(); this.focus(nextEnabled(current, -1)); break;
      case "Home": event.preventDefault(); this.focus(nextEnabled(-1, 1)); break;
      case "End": event.preventDefault(); this.focus(nextEnabled(this.visible().length, -1)); break;
      case "Enter": case " ": event.preventDefault(); this.select(item); break;
      case "ArrowRight": case "ArrowLeft": {
        event.preventDefault(); const open = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
        if (open && this.hasChildren(item.node) && !this.isExpanded(item.node)) this.toggle(item);
        else if (open && this.isExpanded(item.node)) this.focus(current + 1);
        else if (!open && this.isExpanded(item.node)) this.toggle(item);
        else if (!open && item.parent) this.focus(this.visible().findIndex(entry => entry.node === item.parent));
        break;
      }
      default: {
        if (event.key.length === 1) { const match = this.visible().findIndex(entry => entry.node.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase())); if (match >= 0) { event.preventDefault(); this.focus(match); } }
      }
    }
  }
}
