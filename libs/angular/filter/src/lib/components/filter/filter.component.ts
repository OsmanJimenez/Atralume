import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { TuiFilter } from "@taiga-ui/kit";
import type { PolymorpheusContent } from "@taiga-ui/polymorpheus";

export interface AtralumeFilterOption<T> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
  readonly badge?: number | null;
}

/** Typed multi-select filter adapter over `TuiFilter`, including Angular Forms support. */
@Component({
  selector: "atr-filter",
  standalone: true,
  imports: [FormsModule, TuiFilter],
  templateUrl: "./filter.component.html",
  styleUrl: "./filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeFilter),
      multi: true,
    },
  ],
  host: { class: "atr-filter", "[attr.aria-label]": "label()" },
})
export class AtralumeFilter<T> implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly options = input<readonly AtralumeFilterOption<T>[]>([]);
  readonly size = input<"s" | "m" | "l">("m");
  readonly optionTemplate = input<TemplateRef<{
    $implicit: AtralumeFilterOption<T>;
  }> | null>(null);
  readonly selectionChange = output<readonly T[]>();
  readonly cleared = output<void>();
  protected readonly selected = signal<readonly AtralumeFilterOption<T>[]>([]);
  protected readonly disabled = signal(false);
  protected readonly content = computed<PolymorpheusContent<{
    $implicit: AtralumeFilterOption<T>;
  }>>(
    () =>
      this.optionTemplate() ??
      ((context: { $implicit: AtralumeFilterOption<T> }) =>
        context.$implicit.label),
  );
  protected readonly badgeHandler = (option: AtralumeFilterOption<T>) =>
    option.badge ?? null;
  protected readonly disabledItemHandler = (option: AtralumeFilterOption<T>) =>
    !!option.disabled || this.disabled();
  private onChange: (value: readonly T[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: readonly T[] | null): void {
    const selected = new Set(value ?? []);
    this.selected.set(
      this.options().filter((option) => selected.has(option.value)),
    );
  }
  registerOnChange(fn: (value: readonly T[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
  protected update(value: readonly AtralumeFilterOption<T>[]): void {
    this.selected.set(value);
    const selection = value.map((option) => option.value);
    this.onChange(selection);
    this.onTouched();
    this.selectionChange.emit(selection);
  }
  clear(): void {
    if (this.disabled()) return;
    this.update([]);
    this.cleared.emit();
  }
}
