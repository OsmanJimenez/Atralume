import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";

import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";

@Component({
  selector: "atr-template-demo",
  imports: [
    FormsModule,
    AtralumeFormField,
    AtralumeControlLabel,
    AtralumeInput,

    AtralumeCheckbox,
    AtralumeRadio,
    AtralumeSwitch,
  ],
  templateUrl: "./template-demo.component.html",
  styleUrl: "./template-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDemo {
  email = "";
  accepted = false;
  plan = "personal";
  notifications = false;
}
