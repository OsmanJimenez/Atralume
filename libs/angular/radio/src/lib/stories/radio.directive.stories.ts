import { FormsModule } from "@angular/forms";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeRadio } from "../../index";

export default {
  title: "Atoms/Radio",
  decorators: [
    moduleMetadata({
      imports: [FormsModule, AtralumeRadio, AtralumeControlLabel],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

/** Uses ngModel for the selected value; adapter stays enabled without TuiRadio. */
export const Playground: Story = {
  args: {
    selectedPlan: "personal",
    disabled: false,
    invalid: false,
  },
  argTypes: {
    selectedPlan: {
      control: "select",
      options: ["personal", "business"],
    },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template: `
      <fieldset [attr.aria-invalid]="invalid ? 'true' : null">
        <legend>Plan</legend>
        <label atrControlLabel>
          <input
            atrRadio
            type="radio"
            name="playground-plan"
            value="personal"
            [(ngModel)]="selectedPlan"
            [disabled]="disabled"
          />
          <span>Personal</span>
        </label>
        <label atrControlLabel>
          <input
            atrRadio
            type="radio"
            name="playground-plan"
            value="business"
            [(ngModel)]="selectedPlan"
            [disabled]="disabled"
          />
          <span>Business</span>
        </label>
      </fieldset>
    `,
  }),
};
