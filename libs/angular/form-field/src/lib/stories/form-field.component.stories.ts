import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within } from "storybook/test";
import {
  AtralumeFormField,
  TuiLabel,
  TuiTextfield,
} from "../../index";
import { AtralumeInput } from "@atralume/angular/input";

const meta = {
  title: "Forms/Form Field",
  component: AtralumeFormField,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AtralumeFormField, AtralumeInput, TuiLabel, TuiTextfield],
    }),
  ],
  args: {
    label: "Email",
    appearance: "outline",
    density: "comfortable",
    hint: "Use your work email.",
    error: "",
    required: false,
    optional: false,
    optionalText: "Optional",
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    appearance: { control: "select", options: ["outline", "filled"] },
    density: { control: "select", options: ["comfortable", "compact"] },
    hint: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    optionalText: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-form-field
        [appearance]="appearance"
        [density]="density"
        [hint]="hint || null"
        [error]="error || null"
        [required]="required"
        [optional]="optional"
        [optionalText]="optionalText"
      >
        <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
          <label tuiLabel>
            {{ label }}
            @if (required) { *}
            @if (optional) { ({{ optionalText }})}
          </label>
          <input atrInput type="email" [disabled]="disabled" [required]="required" />
        </tui-textfield>
      </atr-form-field>
    `,
  }),
};

export const Invalid: Story = {
  args: { error: "Enter a valid email address." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Enter a valid email address."),
    ).toHaveAttribute("aria-live", "polite");
  },
};

export const Compact: Story = {
  args: { density: "compact", hint: "Compact density uses the same token bridge." },
};

export const Filled: Story = {
  args: { appearance: "filled", hint: "Filled appearance for denser surfaces." },
};
