import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { TuiIcon } from "@taiga-ui/core";
import { TuiPassword } from "@taiga-ui/kit";
import { AtralumeInput } from "@osmanjimenez/atralume/input";
import { AtralumeFormField, TuiLabel, TuiTextfield } from "../../index";

const meta = {
  title: "Forms/Password Field",
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeFormField,
        AtralumeInput,
        TuiLabel,
        TuiTextfield,
        TuiIcon,
        TuiPassword,
      ],
    }),
  ],
  args: {
    label: "Password",
    hint: "Use at least 12 characters.",
    error: "",
    disabled: false,
    required: true,
  },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-form-field
        [hint]="hint || null"
        [error]="error || null"
        [required]="required"
      >
        <tui-textfield [invalid]="!!error" tuiTextfieldSize="m">
          <label tuiLabel>
            {{ label }}
            @if (required) { *}
          </label>
          <input
            atrInput
            type="password"
            autocomplete="current-password"
            [disabled]="disabled"
            [required]="required"
          />
          <tui-icon tuiPassword />
        </tui-textfield>
      </atr-form-field>
    `,
  }),
};

export const Invalid: Story = {
  args: {
    error: "Password must be at least 12 characters.",
  },
  render: Playground.render,
};
