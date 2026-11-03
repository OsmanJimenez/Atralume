import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  model,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import { AtralumeCombobox } from "@atralume/angular/combobox";
import type { AtralumeOptionData } from "@atralume/angular/listbox";

/**
 * Thin Autocomplete over `atr-combobox` / Taiga `tuiComboBox` (filter on).
 */
@Component({
  selector: "atr-autocomplete",
  standalone: true,
  imports: [AtralumeCombobox],
  templateUrl: "./autocomplete.component.html",
  styleUrl: "./autocomplete.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeAutocomplete),
      multi: true,
    },
  ],
  host: { class: "atr-autocomplete" },
})
export class AtralumeAutocomplete<T> extends ɵAtralumeValueControl<
  T | string | null
> {
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly query = model("");
  readonly placeholder = input("Search");
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly displayWith = input<((value: T) => string) | null>(null);
  readonly strict = input(false, { transform: booleanAttribute });
  readonly emptyText = input("No results");
}
