import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import {
  AtralumeFormField,
  AtralumeControlLabel,
  TuiTextfield,
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
  title: "Forms/Form Field",
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
        TuiTextfield,
        FormsDemo,
        SignalDemo,
        TemplateDemo,
      ],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

/** Single controls playground covering appearance, hint, error, required, optional. */
export const Playground: Story = {
  args: {
    label: "Email",
    appearance: "outline",
    hint: "Use your work email.",
    error: "",
    required: false,
    optional: false,
    disabled: false,
    value: "",
  },
  argTypes: {
    label: { control: "text" },
    appearance: { control: "select", options: ["outline", "filled"] },
    hint: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template: `
      <section class="atr-forms-demo">
        <atr-form-field
          [appearance]="appearance"
          [hint]="hint || null"
          [error]="error || null"
        >
          <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
            <label tuiLabel>
              {{ label }}
              @if (required) { *}
              @if (optional) { (optional)}
            </label>
            <input atrInput type="email" [disabled]="disabled" [value]="value" />
          </tui-textfield>
        </atr-form-field>
      </section>
    `,
  }),
};

export const ReactiveForms: Story = {
  render: () => ({ template: "<atr-forms-demo />" }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Taiga floating `tuiLabel` is visual; wire plays to the native control.
    const email = canvasElement.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    await expect(email).toBeTruthy();
    await userEvent.type(email, "invalid");
    await userEvent.tab();
    await expect(c.getByText("Enter a valid email address.")).toBeVisible();
  },
};

export const TemplateDrivenForms: Story = {
  render: () => ({ template: "<atr-template-demo />" }),
};

export const SignalForms: Story = {
  render: () => ({ template: "<atr-signal-demo />" }),
};
