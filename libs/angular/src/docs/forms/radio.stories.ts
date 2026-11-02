import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";
import { FormsDemo } from "./forms-demo.component";
import { SignalDemo } from "./signal-demo.component";
import { TemplateDemo } from "./template-demo.component";

export default {
  title: "Forms/Radio",
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeFormField,
        AtralumeControlLabel,
        AtralumeInput,
        AtralumeTextarea,
        AtralumeCheckbox,
        AtralumeRadio,
        AtralumeSwitch,
        FormsDemo,
        SignalDemo,
        TemplateDemo,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const RadioGroup: Story = {
  render: () => ({
    template:
      '<div class="atr-forms-demo"><fieldset><legend>Plan</legend><label atrControlLabel><input atrRadio type="radio" name="plan" value="personal" checked /><span>Personal</span></label><label atrControlLabel><input atrRadio type="radio" name="plan" value="business" /><span>Business</span></label><label atrControlLabel><input atrRadio type="radio" name="plan" value="disabled" disabled /><span>Unavailable</span></label></fieldset></div>',
  }),
};
export const ReactiveForms: Story = {
  render: () => ({ template: "<atr-forms-demo />" }),
};
export const TemplateDrivenForms: Story = {
  render: () => ({ template: "<atr-template-demo />" }),
};
export const SignalForms: Story = {
  render: () => ({ template: "<atr-signal-demo />" }),
};
export const Interaction: Story = {
  ...RadioGroup,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const personal = c.getByLabelText("Personal");
    const business = c.getByLabelText("Business");
    personal.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(business).toBeChecked();
    await expect(personal).not.toBeChecked();
    await expect(c.getByLabelText("Unavailable")).toBeDisabled();
  },
};
