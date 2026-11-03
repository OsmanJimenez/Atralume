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
  untracked,
} from "@angular/core";
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { TuiDataListWrapper, TuiSelect } from "@taiga-ui/kit";
import { TuiChevron } from "@taiga-ui/kit/directives/chevron";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import type { AtralumeOptionData } from "@atralume/angular/listbox";
import { AtralumeSelectDirective } from "../../directives/select.directive";

/**
 * Thin Select recipe over Taiga `tuiSelect` + `tui-data-list-wrapper`.
 *
 * Breaking: single value `T | null` (no `multiple`/chips on this host). Use
 * `tui-textfield[multi]` + chip controls for multi. Overlay/listbox engines
 * removed — dropdown is Taiga's.
 */
@Component({
  selector: "atr-select",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AtralumeFormField,
    TuiSelect,
    TuiChevron,
    TuiDataListWrapper,
    AtralumeSelectDirective,
  ],
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeSelect),
      multi: true,
    },
  ],
  host: { class: "atr-select" },
})
export class AtralumeSelect<T> extends ɵAtralumeValueControl<T | null> {
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly placeholder = input("Choose an option");
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly emptyText = input("No results");
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

  /** Inner CVA host for Taiga `tuiSelect` (avoid stacking ngModel on TuiControl). */
  protected readonly inner = new FormControl<T | null>(null);

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
