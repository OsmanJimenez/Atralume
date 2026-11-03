import { Directive, forwardRef } from "@angular/core";
import { TuiNativeValidator } from "@taiga-ui/cdk";
import { TuiWithAppearance } from "@taiga-ui/core/directives/appearance";
import {
  ɵAtralumeNativeTextControl,
  ɵATR_FORM_FIELD_CONTROL,
} from "@atralume/angular";

/**
 * Native file input styled for Taiga `tuiInputFiles`.
 *
 * Does not host `TuiInputFilesDirective` (that directive is a CVA; value stays
 * on `atr-file-upload`). Pair with `label[tuiInputFiles]`.
 */
@Directive({
  selector: "input[atrFileInput]",
  standalone: true,
  hostDirectives: [TuiNativeValidator, TuiWithAppearance],
  providers: [
    {
      provide: ɵATR_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => AtralumeFileInput),
    },
  ],
  host: {
    class: "atr-file-input",
    "[attr.tuiInputFiles]": '""',
  },
})
export class AtralumeFileInput extends ɵAtralumeNativeTextControl {}
