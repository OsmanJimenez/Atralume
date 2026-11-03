import { Directive, input } from "@angular/core";
import { TuiList } from "@taiga-ui/layout";

/** Adapter over Taiga UI `TuiList`; keeps Atralume density tokens. */
@Directive({
  selector: "ul[atrList], ol[atrList]",
  standalone: true,
  hostDirectives: [{ directive: TuiList, inputs: ["tuiList: tuiSize"] }],
  host: {
    class: "atr-list",
    "[attr.tuiList]": '""',
    "[attr.data-density]": "density()",
  },
})
export class AtralumeList {
  readonly density = input<"comfortable" | "compact">("comfortable");
}
