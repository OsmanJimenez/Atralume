import { Directive, input } from "@angular/core";
import { TuiLink } from "@taiga-ui/core";

export type LinkAppearance = "inline" | "standalone";
export type LinkUnderline = "always" | "hover";

/** Adapter over Taiga UI `TuiLink`; keeps Atralume selector and underline API. */
@Directive({
  selector: "a[atrLink]",
  standalone: true,
  hostDirectives: [TuiLink],
  host: {
    class: "atr-link",
    "[attr.tuiLink]": '""',
    "[attr.data-appearance]": "appearance()",
    "[attr.data-underline]": "underline()",
  },
})
export class AtralumeLink {
  readonly appearance = input<LinkAppearance>("inline");
  readonly underline = input<LinkUnderline>("always");
}
