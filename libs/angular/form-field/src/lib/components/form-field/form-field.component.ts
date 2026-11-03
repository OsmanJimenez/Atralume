import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from "@angular/core";

export type AtralumeFormFieldAppearance = "outline" | "filled";
export type AtralumeFormFieldDensity = "comfortable" | "compact";

/**
 * Brand chrome (hint/error/density attrs) around a Taiga `tui-textfield`.
 *
 * Breaking: project a consumer-authored `tui-textfield` with
 * `label[tuiLabel]` and `input[atrInput]` / `textarea[atrTextarea]`.
 * Do not project a bare input into this host — `TuiInputDirective` must
 * inject `TuiTextfieldComponent` from the same consumer template tree.
 *
 * @example
 * ```html
 * <atr-form-field [hint]="hint" [error]="error">
 *   <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
 *     <label tuiLabel>Email</label>
 *     <input atrInput type="email" formControlName="email" />
 *   </tui-textfield>
 * </atr-form-field>
 * ```
 */
@Component({
  selector: "atr-form-field",
  standalone: true,
  templateUrl: "./form-field.component.html",
  styleUrl: "./form-field.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-form-field-host",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-density]": "density()",
  },
})
export class AtralumeFormField {
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly appearance = input<AtralumeFormFieldAppearance>("outline");
  readonly density = input<AtralumeFormFieldDensity>("comfortable");
  /** Kept for call-site compatibility; render label inside `tui-textfield`. */
  readonly label = input<string>("");
  readonly required = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly optionalText = input("Optional");
}
