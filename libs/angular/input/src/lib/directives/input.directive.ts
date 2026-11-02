import { Directive, forwardRef, isDevMode } from "@angular/core";
import {
  ɵATR_FORM_FIELD_CONTROL,
  ɵAtralumeNativeTextControl,
} from "@atralume/angular";
@Directive({
  selector: "input[atrInput]",
  standalone: true,
  host: { class: "atr-input" },
  providers: [
    {
      provide: ɵATR_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => AtralumeInput),
    },
  ],
})
export class AtralumeInput extends ɵAtralumeNativeTextControl {
  constructor() {
    super();
    if (
      isDevMode() &&
      [
        "checkbox",
        "radio",
        "file",
        "range",
        "color",
        "button",
        "submit",
        "reset",
        "hidden",
        "image",
      ].includes(this.element.type)
    )
      throw new Error("atrInput requires a text-like native input.");
  }
}
