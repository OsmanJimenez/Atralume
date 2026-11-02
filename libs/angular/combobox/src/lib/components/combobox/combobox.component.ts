import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
  afterNextRender,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  ɵAtralumeOverlayInfrastructure,
  type ɵOverlayHandle,
} from "@atralume/angular";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  closeIcon,
  chevronDownIcon,
} from "@atralume/angular/icon";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeComboboxInput } from "../../directives/combobox-input.directive";
import {
  AtralumeComboboxPopup,
  AtralumeComboboxEmpty,
  AtralumeComboboxLoading,
} from "../../directives/combobox-state.directive";
import { AtralumeChip } from "@atralume/angular/chip";
import { AtralumeProgressSpinner } from "@atralume/angular/progress";
import {
  AtralumeListbox,
  type AtralumeOptionData,
  type AtralumeOptionTemplateContext,
} from "@atralume/angular/listbox";
import { AtralumeComboboxTrigger } from "../../directives/combobox-trigger.directive";
export type AutocompleteStrategy = "manual" | "automatic";
export type SelectionDisplay = "text" | "count" | "chips";
@Component({
  selector: "atr-combobox",
  standalone: true,
  templateUrl: "./combobox.component.html",
  styleUrl: "./combobox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    AtralumeButton,
    AtralumeIconButton,
    AtralumeIcon,
    AtralumeFormField,
    AtralumeComboboxInput,
    AtralumeComboboxPopup,
    AtralumeComboboxEmpty,
    AtralumeComboboxLoading,
    AtralumeChip,
    AtralumeProgressSpinner,
    AtralumeListbox,
    AtralumeComboboxTrigger,
  ],
  providers: [
    provideAtralumeIcons([closeIcon, chevronDownIcon]),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeCombobox),
      multi: true,
    },
  ],
  host: { class: "atr-combobox" },
})
export class AtralumeCombobox<T> extends ɵAtralumeValueControl<
  T | readonly T[]
> {
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly editable = input(true, { transform: booleanAttribute });
  readonly opened = model(false);
  readonly query = model("");
  readonly placeholder = input("Choose an option");
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadError = input<string | null>(null);
  readonly minimumCharacters = input(0);
  readonly filterOptions = input(true, { transform: booleanAttribute });
  readonly autocomplete = input<AutocompleteStrategy>("manual");
  readonly textToValue = input<((text: string) => T) | null>(null);
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly displayWith = input<((value: T) => string) | null>(null);
  readonly display = input<SelectionDisplay>("text");
  readonly inline = input(false, { transform: booleanAttribute });
  readonly optionTemplate = input<TemplateRef<
    AtralumeOptionTemplateContext<T>
  > | null>(null);
  readonly triggerTemplate = input<TemplateRef<{
    $implicit: readonly T[];
  }> | null>(null);
  readonly emptyText = input("No results");
  readonly loadingText = input("Loading options");
  readonly activeId = signal<string | null>(null);
  protected readonly composing = signal(false);
  readonly selectedValues = computed<readonly T[]>(() => {
    const value = this.value();
    if (value === null) return [];
    return this.multiple()
      ? Array.isArray(value)
        ? (value as readonly T[])
        : []
      : [value as T];
  });
  readonly displayValue = computed(() =>
    this.selectedValues()
      .map((value) => this.displayLabel(value))
      .join(", "),
  );
  readonly popupId = computed(() => this.controlId() + "-listbox");
  readonly filteredOptions = computed(() => {
    const query = this.editable()
      ? this.query().trim().toLocaleLowerCase()
      : "";
    if (query.length < this.minimumCharacters()) return [];
    return this.options()
      .filter(
        (option) =>
          !this.filterOptions() ||
          !query ||
          [option.label, ...(option.keywords ?? [])].some((text) =>
            text.toLocaleLowerCase().includes(query),
          ),
      )
      .map((option) => ({ ...option, id: this.popupId() + "-" + option.id }));
  });
  private readonly popup = viewChild.required<TemplateRef<unknown>>("popup");
  private readonly list = viewChild(AtralumeListbox);
  private readonly views = inject(ViewContainerRef);
  private readonly owner = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private overlay: ɵOverlayHandle<unknown> | null = null;
  constructor() {
    super();
    effect(() => {
      const value = this.displayValue();
      untracked(() => {
        if (!this.opened()) this.query.set(value);
      });
    });
    effect((onCleanup) => {
      const opened = this.opened(),
        blocked = this.blocked(),
        inline = this.inline();
      this.popup();
      if (!opened || blocked || inline) return;
      let cleanup = () => undefined as void;
      const render = afterNextRender(
        () => {
          const origin = this.element.querySelector<HTMLElement>(
            "[data-atr-value-control]",
          );
          if (!origin || !this.opened() || this.blocked()) return;
          const ref = this.engine.openConnected(
            this.popup(),
            this.views,
            origin,
            {
              owner: this.owner,
              matchWidth: true,
              panelClass: "atr-combobox-panel",
            },
          );
          this.overlay = ref;
          const subscription = ref.afterClosed.subscribe(() => {
            if (this.overlay === ref) {
              this.overlay = null;
              this.opened.set(false);
              this.activeId.set(null);
            }
          });
          cleanup = () => {
            subscription.unsubscribe();
            if (this.overlay === ref) this.overlay = null;
            ref.close();
          };
        },
        { injector: this.injector },
      );
      onCleanup(() => {
        render.destroy();
        cleanup();
      });
    });
    effect(() => {
      const list = this.list();
      const options = this.filteredOptions();
      if (
        this.autocomplete() === "automatic" &&
        this.opened() &&
        options.length &&
        list
      )
        afterNextRender(() => list.activateFirst(), {
          injector: this.injector,
        });
    });
    effect(() => {
      if (this.blocked()) this.opened.set(false);
    });
  }
  displayLabel(value: T): string {
    const display = this.displayWith();
    return display
      ? display(value)
      : (this.options().find((option) =>
          this.compareWith()(option.value, value),
        )?.label ?? String(value));
  }
  open(): void {
    if (!this.blocked() && !this.readonly()) this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
    this.activeId.set(null);
    this.query.set(this.displayValue());
  }
  toggle(): void {
    if (this.opened()) this.close();
    else this.open();
  }
  private confirmFirstMatch(): void {
    const [first] = this.filteredOptions();
    if (!first) return;
    this.activeId.set(first.id);
    this.choose([first.value]);
  }
  protected typed(event: Event): void {
    if (this.composing() || this.blocked() || this.readonly()) return;
    const query = (event.target as HTMLInputElement).value;
    this.query.set(query);
    const convert = this.textToValue();
    if (convert && !this.multiple()) this.commit(convert(query));
    this.open();
  }
  protected compositionEnd(event: CompositionEvent): void {
    this.composing.set(false);
    this.typed(event);
  }
  protected key(event: KeyboardEvent): void {
    if (
      event.isComposing ||
      this.composing() ||
      this.blocked() ||
      this.readonly()
    )
      return;
    if (event.key === "Escape") {
      if (this.opened()) {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
      return;
    }
    if (event.key === "Tab") {
      this.close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const activate = () => {
        const list = this.list();
        if (list) {
          event.key === "ArrowDown" ? list.activateFirst() : list.activateLast();
          return;
        }
        const options = this.filteredOptions();
        if (!options.length) return;
        const currentIndex = options.findIndex(
          (option) => option.id === this.activeId(),
        );
        const nextIndex =
          currentIndex < 0
            ? event.key === "ArrowDown"
              ? 0
              : options.length - 1
            : Math.min(
                Math.max(
                  currentIndex + (event.key === "ArrowDown" ? 1 : -1),
                  0,
                ),
                options.length - 1,
              );
        this.activeId.set(options[nextIndex].id);
      };
      if (!this.opened()) {
        this.open();
        afterNextRender(activate, { injector: this.injector });
      } else {
        const list = this.list();
        if (list) list.onKey(event);
        else afterNextRender(activate, { injector: this.injector });
      }
      return;
    }
    if (event.key === "Enter" || (!this.editable() && event.key === " ")) {
      event.preventDefault();
      if (this.opened()) {
        const current = this.filteredOptions().find(
          (option) => option.id === this.activeId(),
        );
        if (current) {
          this.choose([current.value]);
          return;
        }
        const list = this.list();
        if (list) {
          list.confirmActive();
          return;
        }
        this.confirmFirstMatch();
        return;
      }
      this.open();
      return;
    }
    if (!this.editable()) {
      if (!this.opened()) this.open();
      this.list()?.onKey(event);
    }
  }
  protected choose(values: readonly T[]): void {
    if (!this.multiple()) {
      const next = values[0] ?? null;
      if (next !== null) this.query.set(this.displayLabel(next));
    }
    this.commit(this.multiple() ? values : (values[0] ?? null));
  }
  protected chosen(): void {
    if (!this.multiple() && !this.inline()) {
      this.close();
      this.focus();
    }
  }
  clear(): void {
    this.commit(this.multiple() ? [] : null);
    this.query.set("");
    this.focus();
  }
  remove(value: T): void {
    this.commit(
      this.selectedValues().filter((item) => !this.compareWith()(item, value)),
    );
  }
  protected override blur(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      this.element.contains(event.relatedTarget as Node)
    )
      return;
    super.blur(event);
    this.close();
  }
}
