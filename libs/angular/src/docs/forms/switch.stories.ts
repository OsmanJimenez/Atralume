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
  title: "Forms/Switch",
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
export const WithDescription: Story = {
  render: () => ({
    template:
      '<div class="atr-forms-demo"><label atrControlLabel><input atrSwitch type="checkbox"  /><span>Enable notifications<span class="atr-control-label__description">Change this preference at any time.</span></span></label></div>',
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
  ...ReactiveForms,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const control = c.getByRole("switch");
    const before = (control as HTMLInputElement).checked;
    await userEvent.click(control);
    await expect(control).toHaveProperty("checked", !before);
    control.focus();
    await userEvent.keyboard(" ");
    await expect(control).toHaveProperty("checked", before);
    await userEvent.click(c.getByRole("button", { name: "Toggle disabled" }));
    await expect(control).toBeDisabled();
  },
};
