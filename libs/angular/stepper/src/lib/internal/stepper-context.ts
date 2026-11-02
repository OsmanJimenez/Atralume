import { InjectionToken } from "@angular/core";
/** @internal */
export interface StepperContext {
  next(): void;
  previous(): void;
}
export const STEPPER_CONTEXT = new InjectionToken<StepperContext>(
  "AtralumeStepper",
);
