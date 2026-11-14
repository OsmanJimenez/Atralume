import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { TuiLabel, TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@osmanjimenez/atralume/input";

/** A self-contained catalogue search field, exposing only Atralume's API. */
@Component({
  selector: "atr-search-field",
  standalone: true,
  imports: [TuiTextfield, TuiLabel, AtralumeInput],
  template: `
    <tui-textfield tuiTextfieldSize="m">
      <label tuiLabel>{{ label() }}</label>
      <input atrInput type="search" [value]="value()" [placeholder]="placeholder()"
        (input)="valueChange.emit($any($event.target).value)" />
    </tui-textfield>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-search-field" },
})
export class AtralumeSearchField {
  readonly label = input("Buscar");
  readonly placeholder = input("");
  readonly value = input("");
  readonly valueChange = output<string>();
}
