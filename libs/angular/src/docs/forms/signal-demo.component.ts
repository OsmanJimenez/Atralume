import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@osmanjimenez/atralume/form-field";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@osmanjimenez/atralume/input";
import { AtralumeTextarea } from "@osmanjimenez/atralume/textarea";
import { AtralumeCheckbox } from "@osmanjimenez/atralume/checkbox";
import { AtralumeRadio } from "@osmanjimenez/atralume/radio";
import { AtralumeSwitch } from "@osmanjimenez/atralume/switch";
import { form, FormField } from "@angular/forms/signals";
@Component({
  selector: "atr-signal-demo",
  imports: [
    FormField,
    AtralumeFormField,
    AtralumeControlLabel,
    AtralumeInput,
    AtralumeTextarea,
    AtralumeCheckbox,
    AtralumeRadio,
    AtralumeSwitch,
    TuiTextfield,
  ],
  templateUrl: "./signal-demo.component.html",
  styleUrl: "./signal-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalDemo {
  readonly model = signal({
    email: "",
    notes: "",
    accepted: false,
    plan: "personal",
    notifications: false,
  });
  readonly fields = form(this.model);
}
