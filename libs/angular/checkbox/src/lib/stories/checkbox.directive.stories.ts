import { FormsModule } from "@angular/forms";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeCheckbox } from "../../index";

export default {
  title: "Atoms/Checkbox",
  decorators: [
    moduleMetadata({
      imports: [FormsModule, AtralumeCheckbox, AtralumeControlLabel],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

/** Uses ngModel for two-way checked state; adapter stays enabled without TuiCheckbox. */
export const Playground: Story = {
  args: {
    label: "Accept terms",
    checked: false,
    indeterminate: false,
    disabled: false,
    invalid: false,
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template: `
      <label atrControlLabel>
        <input
          atrCheckbox
          type="checkbox"
          name="terms"
          [(ngModel)]="checked"
          [indeterminate]="indeterminate"
          [disabled]="disabled"
          [attr.aria-invalid]="invalid ? 'true' : null"
        />
        <span>{{ label }}</span>
      </label>
    `,
  }),
};
