import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AtralumeButton } from "@atralume/angular/button";
import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@atralume/angular/form-field";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";

@Component({
  selector: "atr-forms-demo",
  imports: [
    ReactiveFormsModule,
    AtralumeButton,
    AtralumeFormField,
    AtralumeControlLabel,
    AtralumeInput,
    AtralumeTextarea,
    AtralumeCheckbox,
    AtralumeRadio,
    AtralumeSwitch,
    TuiTextfield,
  ],
  templateUrl: "./forms-demo.component.html",
  styleUrl: "./forms-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsDemo {
  readonly submitted = signal(false);
  readonly saved = signal(false);
  readonly readonly = signal(false);
  readonly glass = signal(false);
  readonly form = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    notes: new FormControl("", { nonNullable: true }),
    terms: new FormControl(false, {
      nonNullable: true,
      validators: Validators.requiredTrue,
    }),
    plan: new FormControl("personal", { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
  });
  error(name: "email" | "password"): string | null {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted())
      ? name === "email"
        ? "Enter a valid email address."
        : "Use at least 8 characters."
      : null;
  }
  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.saved.set(this.form.valid);
  }
  toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }
}
