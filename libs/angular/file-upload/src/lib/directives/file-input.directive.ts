import { Directive, forwardRef } from "@angular/core";
import {
  ɵAtralumeNativeTextControl,
  ɵATR_FORM_FIELD_CONTROL,
} from "@atralume/angular";
/** @internal Uses the existing native field bridge without assigning a file value accessor. */
@Directive({
  selector: "input[atrFileInput]",
  standalone: true,
  providers: [
    {
      provide: ɵATR_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => AtralumeFileInput),
    },
  ],
})
export class AtralumeFileInput extends ɵAtralumeNativeTextControl {}
