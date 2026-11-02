import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";
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
