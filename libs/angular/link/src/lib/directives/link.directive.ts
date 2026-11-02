import { Directive, input } from "@angular/core";
export type LinkAppearance = "inline" | "standalone";
export type LinkUnderline = "always" | "hover";
@Directive({
  selector: "a[atrLink]",
  standalone: true,
  host: {
    class: "atr-link",
    "[attr.data-appearance]": "appearance()",
    "[attr.data-underline]": "underline()",
  },
})
export class AtralumeLink {
  readonly appearance = input<LinkAppearance>("inline");
  readonly underline = input<LinkUnderline>("always");
}
