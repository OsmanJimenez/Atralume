import { Directive } from "@angular/core";
@Directive({
  selector: "[atrComboboxPopup]",
  standalone: true,
  host: { class: "atr-combobox-popup" },
})
export class AtralumeComboboxPopup {}
@Directive({
  selector: "[atrComboboxEmpty]",
  standalone: true,
  host: { class: "atr-combobox-empty", role: "status" },
})
export class AtralumeComboboxEmpty {}
@Directive({
  selector: "[atrComboboxLoading]",
  standalone: true,
  host: { class: "atr-combobox-loading", role: "status" },
})
export class AtralumeComboboxLoading {}
