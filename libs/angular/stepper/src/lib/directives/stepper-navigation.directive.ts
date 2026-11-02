import { Directive, inject } from "@angular/core";
import { STEPPER_CONTEXT } from "../internal/stepper-context";
@Directive({
  selector: "button[atrStepperNext]",
  standalone: true,
  host: { type: "button", "(click)": "stepper.next()" },
})
export class AtralumeStepperNext {
  protected readonly stepper = inject(STEPPER_CONTEXT);
}
@Directive({
  selector: "button[atrStepperPrevious]",
  standalone: true,
  host: { type: "button", "(click)": "stepper.previous()" },
})
export class AtralumeStepperPrevious {
  protected readonly stepper = inject(STEPPER_CONTEXT);
}
