import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@osmanjimenez/atralume/form-field";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@osmanjimenez/atralume/input";

import { AtralumeCheckbox } from "@osmanjimenez/atralume/checkbox";
import { AtralumeRadio } from "@osmanjimenez/atralume/radio";
import { AtralumeSwitch } from "@osmanjimenez/atralume/switch";

@Component({
  selector: "atr-template-demo",
  imports: [
    FormsModule,
    AtralumeFormField,
    AtralumeControlLabel,
    AtralumeInput,
    TuiTextfield,
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
