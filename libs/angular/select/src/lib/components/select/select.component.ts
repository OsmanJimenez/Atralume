import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  forwardRef,
  input,
  model,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import {
  AtralumeCombobox,
  type AutocompleteStrategy,
  type SelectionDisplay,
} from "@atralume/angular/combobox";
import type {
  AtralumeOptionData,
  AtralumeOptionTemplateContext,
} from "@atralume/angular/listbox";
@Component({
  selector: "atr-select",
  standalone: true,
  imports: [AtralumeCombobox],
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
export class AtralumeSelect<T> extends ɵAtralumeValueControl<T | readonly T[]> {
  readonly options = input<readonly AtralumeOptionData<T>[]>([]);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly opened = model(false);
  readonly query = model("");
  readonly placeholder = input("Choose an option");
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadError = input<string | null>(null);
  readonly compareWith = input<(a: T, b: T) => boolean>(Object.is);
  readonly displayWith = input<((value: T) => string) | null>(null);
  readonly display = input<SelectionDisplay>("text");
  readonly mode = input<AutocompleteStrategy>("manual");
  readonly minimumCharacters = input(0);
  readonly filterOptions = input(false, { transform: booleanAttribute });
  readonly textToValue = input<((text: string) => T) | null>(null);
  readonly optionTemplate = input<TemplateRef<
    AtralumeOptionTemplateContext<T>
  > | null>(null);
  readonly triggerTemplate = input<TemplateRef<{
    $implicit: readonly T[];
  }> | null>(null);
  readonly emptyText = input("No results");
}
