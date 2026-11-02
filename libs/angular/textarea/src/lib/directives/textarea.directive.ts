import { Directive, forwardRef, input } from "@angular/core";
import {
  ɵATR_FORM_FIELD_CONTROL,
  ɵAtralumeNativeTextControl,
} from "@atralume/angular";
export type AtralumeTextareaResize =
  "none" | "vertical" | "horizontal" | "both";
@Directive({
  selector: "textarea[atrTextarea]",
  standalone: true,
  host: { class: "atr-textarea", "[style.resize]": "resize()" },
  providers: [
    {
      provide: ɵATR_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => AtralumeTextarea),
    },
  ],
})
export class AtralumeTextarea extends ɵAtralumeNativeTextControl {
  readonly resize = input<AtralumeTextareaResize>("vertical");
}
