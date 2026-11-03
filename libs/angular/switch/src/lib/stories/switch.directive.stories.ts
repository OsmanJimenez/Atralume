import { FormsModule } from "@angular/forms";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeSwitch } from "../../index";

export default {
  title: "Atoms/Switch",
  decorators: [
    moduleMetadata({
      imports: [FormsModule, AtralumeSwitch, AtralumeControlLabel],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

/** Uses ngModel for two-way checked state; adapter stays enabled without TuiSwitch. */
export const Playground: Story = {
  args: {
    label: "Enable notifications",
    checked: false,
    disabled: false,
    invalid: false,
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template: `
      <label atrControlLabel>
        <input
          atrSwitch
          type="checkbox"
          name="notifications"
          [(ngModel)]="checked"
          [disabled]="disabled"
          [attr.aria-invalid]="invalid ? 'true' : null"
        />
        <span>{{ label }}</span>
      </label>
    `,
  }),
};
