import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
} from "@angular/core";
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { TuiFilterByInputPipe } from "@taiga-ui/core";
import { TuiComboBox, TuiDataListWrapper } from "@taiga-ui/kit";
import { TuiChevron } from "@taiga-ui/kit/directives/chevron";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import type { AtralumeOptionData } from "@atralume/angular/listbox";
import { AtralumeComboBoxDirective } from "../../directives/combo-box.directive";

export type AutocompleteStrategy = "manual" | "automatic";
/** @deprecated Chips/multi moved to `tui-textfield[multi]` + chip controls. */
export type SelectionDisplay = "text" | "count" | "chips";

/**
 * Thin Combobox recipe over Taiga `tuiComboBox` + `tui-data-list-wrapper`.
 *
 * Breaking: single value `T | string | null`; no custom overlay/listbox engine;
 * `multiple`/chips removed from this host.
 */
@Component({
  selector: "atr-combobox",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AtralumeFormField,
    TuiComboBox,
    TuiChevron,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    AtralumeComboBoxDirective,
  ],
  templateUrl: "./combobox.component.html",
  styleUrl: "./combobox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeCombobox),
      multi: true,
    },
  ],
  host: { class: "atr-combobox" },
})
export class AtralumeCombobox<T> extends ɵAtralumeValueControl<
  T | string | null
> {
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly query = model("");
  readonly placeholder = input("Choose an option");
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly emptyText = input("No results");
  readonly strict = input(true, { transform: booleanAttribute });
  readonly filterOptions = input(true, { transform: booleanAttribute });
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly displayWith = input<((value: T) => string) | null>(null);

  readonly items = computed(() => this.options().map((option) => option.value));
  readonly stringify = computed(() => {
    const display = this.displayWith();
    const options = this.options();
    return (value: T) =>
      display?.(value) ??
      options.find((option) => this.compareWith()(option.value, value))
        ?.label ??
      String(value ?? "");
  });
  readonly identityMatcher = computed(
    () => (a: T, b: T) => this.compareWith()(a, b),
  );
  readonly disabledItemHandler = computed(() => {
    const options = this.options();
    const compare = this.compareWith();
    return (value: T) =>
      !!options.find((option) => compare(option.value, value))?.disabled;
  });

  /** Inner CVA host for Taiga `tuiComboBox`. */
  protected readonly inner = new FormControl<T | string | null>(null);

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const sub = this.inner.valueChanges.subscribe((value) =>
      this.commit(value),
    );
    destroyRef.onDestroy(() => sub.unsubscribe());
    effect(() => {
      const next = this.value();
      untracked(() => {
        if (!Object.is(this.inner.value, next)) this.inner.setValue(next);
      });
    });
    effect(() => {
      if (this.blocked()) this.inner.disable({ emitEvent: false });
      else this.inner.enable({ emitEvent: false });
    });
  }
}
