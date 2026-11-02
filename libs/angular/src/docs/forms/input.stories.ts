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
  title: "Forms/Input",
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
export const ReactiveForms: Story = {
  render: () => ({ template: "<atr-forms-demo />" }),
};
export const TemplateDrivenForms: Story = {
  render: () => ({ template: "<atr-template-demo />" }),
};
export const SignalForms: Story = {
  render: () => ({ template: "<atr-signal-demo />" }),
};
export const Validation: Story = {
  ...ReactiveForms,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const email = c.getByLabelText(/Email/);
    await userEvent.type(email, "invalid");
    await userEvent.tab();
    await expect(c.getByText("Enter a valid email address.")).toBeVisible();
    await expect(email).toHaveAccessibleDescription(
      /Enter a valid email address/,
    );
    await userEvent.clear(email);
    await userEvent.type(email, "hello@example.com");
    await userEvent.tab();
    await expect(c.queryByText("Enter a valid email address.")).toBeNull();
  },
};
