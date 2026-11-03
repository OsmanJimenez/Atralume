import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { fn } from "storybook/test";
import {
  AtralumeFormField,
  TuiTextfield,
} from "@atralume/angular/form-field";
import { AtralumeTextarea } from "../../index";

export default {
  title: "Atoms/Textarea",
  decorators: [
    moduleMetadata({
      imports: [AtralumeFormField, AtralumeTextarea, TuiTextfield],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Message",
    value: "",
    placeholder: "Write a message",
    rows: 3,
    maxlength: null,
    resize: "vertical",
    disabled: false,
    readonly: false,
    error: "",
    onInput: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 10, step: 1 } },
    maxlength: { control: { type: "number", min: 1, max: 1000, step: 1 } },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    error: { control: "text" },
    onInput: { control: false },
  },
  render: (args) => ({
    props: args,
    template: `
      <atr-form-field [error]="error || null">
        <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
          <label tuiLabel>{{ label }}</label>
          <textarea
            atrTextarea
            [value]="value"
            [placeholder]="placeholder"
            [rows]="rows"
            [attr.maxlength]="maxlength"
            [resize]="resize"
            [disabled]="disabled"
            [readOnly]="readonly"
            [attr.aria-invalid]="error ? 'true' : null"
            (input)="onInput($event)"
          ></textarea>
        </tui-textfield>
      </atr-form-field>
    `,
  }),
};
