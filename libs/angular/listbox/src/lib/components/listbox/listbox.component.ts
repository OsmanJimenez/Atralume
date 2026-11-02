import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChildren,
  booleanAttribute,
  untracked,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import { AtralumeOption } from "../option/option.component";
import {
  AtralumeOptionGroup,
  AtralumeOptionGroupLabel,
} from "../../directives/option-group.directive";
import {
  LISTBOX_CONTEXT,
  type AtralumeOptionData,
  type AtralumeOptionTemplateContext,
  type FocusMode,
  type SelectionMode,
} from "../../models/listbox.types";
interface ManagedOption {
  disabled: boolean;
  getLabel(): string;
  setActiveStyles(): void;
  setInactiveStyles(): void;
  option: AtralumeOption<unknown>;
}
@Component({
  selector: "atr-listbox",
  standalone: true,
  imports: [
    AtralumeOption,
    AtralumeOptionGroup,
    AtralumeOptionGroupLabel,
    NgTemplateOutlet,
  ],
  templateUrl: "./listbox.component.html",
  styleUrl: "./listbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: LISTBOX_CONTEXT,
      useExisting: forwardRef(() => AtralumeListbox),
    },
  ],
  host: {
    class: "atr-listbox",
    role: "listbox",
    "[attr.aria-label]": "label()",
    "[attr.aria-disabled]": "disabled()",
    "[attr.aria-multiselectable]": 'selectionMode() === "multiple"',
    "[attr.aria-orientation]": "orientation()",
    "[attr.aria-activedescendant]":
      'focusMode() === "activedescendant" ? activeId() : null',
    "[attr.tabindex]":
      'disabled() ? -1 : tabIndex() ?? (focusMode() === "activedescendant" || !items().length ? 0 : -1)',
    "(keydown)": "onKey($event)",
    "(focus)": "initialize()",
  },
})
export class AtralumeListbox<T> {
  readonly label = input.required<string>();
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly value = model<readonly T[]>([]);
  readonly selectionMode = input<SelectionMode>("single");
  readonly focusMode = input<FocusMode>("roving");
  readonly tabIndex = input<number | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly orientation = input<"vertical" | "horizontal">("vertical");
  readonly selectionFollowsFocus = input(false, {
    transform: booleanAttribute,
  });
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly optionTemplate = input<TemplateRef<
    AtralumeOptionTemplateContext<T>
  > | null>(null);
  readonly activeId = signal<string | null>(null);
  readonly activeIdChange = output<string | null>();
  readonly chosen = output<T>();
  private readonly projected = contentChildren(AtralumeOption, {
    descendants: true,
  });
  private readonly rendered = viewChildren(AtralumeOption);
  readonly items = computed(() =>
    [...this.rendered(), ...this.projected()].filter((item) =>
      item.belongsTo(this),
    ),
  );
  readonly groups = computed(() => {
    const groups = new Map<string, AtralumeOptionData<T>[]>();
    const ids = new Set<string>();
    for (const option of this.options()) {
      if (ids.has(option.id))
        throw new Error(
          "Atralume listbox option IDs must be unique: " + option.id,
        );
      ids.add(option.id);
      const group = option.group ?? "";
      const items = groups.get(group) ?? [];
      items.push(option);
      groups.set(group, items);
    }
    return [...groups].map(([label, options]) => ({ label, options }));
  });
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private manager: ActiveDescendantKeyManager<ManagedOption> | undefined;
  constructor() {
    effect((onCleanup) => {
      const items = this.items();
      const disabled = this.disabled();
      const orientation = this.orientation();
      const focusMode = this.focusMode();
      const managed = items.map((option) => ({
        option,
        disabled: disabled || option.disabled(),
        getLabel: () => option.label(),
        setActiveStyles: () => undefined,
        setInactiveStyles: () => undefined,
      }));
      const manager = new ActiveDescendantKeyManager(managed)
        .withHomeAndEnd()
        .withTypeAhead(250)
        .withWrap()
        .withVerticalOrientation(orientation === "vertical")
        .withHorizontalOrientation(
          orientation === "horizontal"
            ? this.element.matches(":dir(rtl)")
              ? "rtl"
              : "ltr"
            : null,
        );
      this.manager = manager;
      const selected = untracked(() => this.value());
      const first = managed.findIndex(
        (item) =>
          !item.disabled &&
          selected.some((value) =>
            this.compareWith()(value, item.option.value() as T),
          ),
      );
      const previous = managed.findIndex(
        (item) =>
          item.option.id() === untracked(this.activeId) && !item.disabled,
      );
      const initial =
        previous >= 0
          ? previous
          : first >= 0
            ? first
            : managed.findIndex((item) => !item.disabled);
      if (initial >= 0) {
        manager.updateActiveItem(initial);
        this.activeId.set(managed[initial].option.id());
        this.activeIdChange.emit(this.activeId());
      } else this.activeId.set(null);
      const subscription = manager.change.subscribe((index) => {
        const item = managed[index];
        if (!item) return;
        this.activeId.set(item.option.id());
        this.activeIdChange.emit(this.activeId());
        if (focusMode === "roving") item.option.focus();
        item.option.element.scrollIntoView?.({
          block: "nearest",
          inline: "nearest",
        });
        if (this.selectionFollowsFocus()) this.choose(item.option.value());
      });
      onCleanup(() => {
        subscription.unsubscribe();
        manager.destroy();
        if (this.manager === manager) this.manager = undefined;
      });
    });
    inject(DestroyRef).onDestroy(() => this.manager?.destroy());
  }
  selected(value: unknown): boolean {
    return this.value().some((item) => this.compareWith()(item, value as T));
  }
  choose(value: unknown): void {
    if (this.disabled() || this.readonly()) return;
    const option = this.items().find((item) =>
      this.compareWith()(item.value() as T, value as T),
    );
    if (!option || option.blocked()) return;
    const selection = new SelectionModel<T>(
      this.selectionMode() === "multiple",
      [...this.value()],
      false,
      this.compareWith(),
    );
    if (this.selectionMode() === "multiple") selection.toggle(value as T);
    else selection.setSelection(value as T);
    this.value.set(selection.selected);
    this.chosen.emit(value as T);
  }
  activateId(id: string): void {
    const index = this.items().findIndex((item) => item.id() === id);
    if (index >= 0 && !this.items()[index].blocked())
      this.manager?.setActiveItem(index);
  }
  initialize(): void {
    if (this.manager?.activeItemIndex === null)
      this.manager.setFirstItemActive();
  }
  activateFirst(): void {
    this.manager?.setFirstItemActive();
  }
  activateLast(): void {
    this.manager?.setLastItemActive();
  }
  confirmActive(): void {
    const item = this.manager?.activeItem?.option;
    if (item) this.choose(item.value());
  }
  onKey(event: KeyboardEvent): void {
    if (this.disabled() || event.isComposing) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.confirmActive();
      return;
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "a" &&
      this.selectionMode() === "multiple" &&
      !this.readonly()
    ) {
      event.preventDefault();
      this.value.set(
        this.items()
          .filter((item) => !item.blocked())
          .map((item) => item.value() as T),
      );
      return;
    }
    this.manager?.onKeydown(event);
  }
}
