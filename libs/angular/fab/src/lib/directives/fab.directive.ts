import { Directive, input, booleanAttribute } from "@angular/core";

@Directive({
  selector: "button[atrFab]",
  standalone: true,
  host: {
    class: "atr-fab",
    "[attr.data-size]": "size()",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-extended]": "extended()",
  },
})
export class AtralumeFab {
  readonly size = input<"small" | "medium" | "large">("medium");
  readonly appearance = input<"primary" | "secondary" | "tertiary" | "surface">(
    "primary",
  );
  readonly extended = input(false, { transform: booleanAttribute });
}
