import { Directive, input } from "@angular/core";
import { AtralumeInput } from "@atralume/angular/input";
export type ComboboxPopupType = "listbox" | "grid" | "dialog" | "tree";
/** Native editing and form-field integration remain owned by Input. */
@Directive({
  selector: "input[atrComboboxInput]",
  standalone: true,
  hostDirectives: [AtralumeInput],
  host: {
    role: "combobox",
    "[attr.aria-expanded]": "opened()",
    "[attr.aria-controls]": "opened()?popupId():null",
    "[attr.aria-activedescendant]": "opened()?activeId():null",
    "[attr.aria-haspopup]": "popupType()",
    "[attr.aria-autocomplete]": "autocomplete()",
  },
})
export class AtralumeComboboxInput {
  readonly opened = input(false);
  readonly popupId = input<string | null>(null);
  readonly activeId = input<string | null>(null);
  readonly popupType = input<ComboboxPopupType>("listbox");
  readonly autocomplete = input<"none" | "list" | "both" | "inline">("list");
}
