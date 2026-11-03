import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AtralumeFormField,
  TuiTextfield,
} from "@atralume/angular/form-field";
import { AtralumeInput } from "../../index";

export default {
  title: "Atoms/Input",
  decorators: [
    moduleMetadata({ imports: [AtralumeFormField, AtralumeInput, TuiTextfield] }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Email",
    type: "email",
    value: "",
    autocomplete: "email",
    placeholder: "you@example.com",
    disabled: false,
    readonly: false,
    required: false,
    error: "",
    onInput: fn(),
  },
  argTypes: {
    label: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
    },
    value: { control: "text" },
    autocomplete: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    error: { control: "text" },
    onInput: { control: false },
  },
  render: (args) => ({
    props: args,
    template: `
      <atr-form-field [error]="error || null">
        <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
          <label tuiLabel>{{ label }}@if (required) { *}</label>
          <input
            atrInput
            [type]="type"
            [value]="value"
            [autocomplete]="autocomplete"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [readOnly]="readonly"
            [attr.aria-invalid]="error ? 'true' : null"
            (input)="onInput($event)"
          />
        </tui-textfield>
      </atr-form-field>
    `,
  }),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: args["label"],
    });
    await userEvent.type(input, "a");
    await expect(args["onInput"]).toHaveBeenCalled();
    await expect(input).toHaveValue(args["value"] + "a");
  },
};
