import { Directive, input } from "@angular/core";
@Directive({
  selector: "[atrOptionGroup]",
  standalone: true,
  host: {
    role: "group",
    "[attr.aria-label]": "label()",
    class: "atr-option-group",
  },
})
export class AtralumeOptionGroup {
  readonly label = input.required<string>();
}
@Directive({
  selector: "[atrOptionGroupLabel]",
  standalone: true,
  host: { class: "atr-option-group-label", "aria-hidden": "true" },
})
export class AtralumeOptionGroupLabel {}
