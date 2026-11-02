import {
  Directive,
  booleanAttribute,
  forwardRef,
  input,
  inject,
  signal,
} from "@angular/core";
import {
  ɵATR_FORM_FIELD_CONTROL,
  ɵAtralumeControlIds,
} from "@atralume/angular";
import type { ComboboxPopupType } from "./combobox-input.directive";
@Directive({
  selector: "button[atrComboboxTrigger]",
  standalone: true,
  providers: [
    {
      provide: ɵATR_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => AtralumeComboboxTrigger),
    },
  ],
  host: {
    role: "combobox",
    class: "atr-combobox-trigger",
    "[id]": "controlId()",
    "[attr.aria-expanded]": "opened()",
    "[attr.aria-controls]": "opened()?popupId():null",
    "[attr.aria-activedescendant]": "opened()?activeId():null",
    "[attr.aria-haspopup]": "popupType()",
    "[attr.aria-invalid]": "invalid()",
    "[attr.aria-readonly]": "readonly()",
    "[attr.aria-describedby]": 'descriptions().join(" ") || null',
    "(focus)": "focused.set(true)",
    "(blur)": "focused.set(false)",
  },
})
export class AtralumeComboboxTrigger {
  readonly controlId = input<string>(inject(ɵAtralumeControlIds).create());
  readonly popupId = input.required<string>();
  readonly opened = input(false);
  readonly popupType = input<ComboboxPopupType>("listbox");
  readonly activeId = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly focused = signal(false);
  readonly descriptions = signal<readonly string[]>([]);
  setDescribedByIds(ids: readonly string[]): void {
    this.descriptions.set(ids);
  }
}
