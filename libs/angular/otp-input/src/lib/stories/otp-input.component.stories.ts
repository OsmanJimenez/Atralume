import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeOtpInput } from "../../index";

const meta = {
  title: "Advanced Forms/OTP Input",
  component: AtralumeOtpInput,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeOtpInput] })],
  args: {
    label: "One-time code",
    length: 4,
    value: null as string | null,
    disabled: false,
    readonly: false,
    required: true,
    hint: "Enter the code from your authenticator.",
    error: null as string | null,
  },
  argTypes: {
    label: { control: "text" },
    length: { control: { type: "number", min: 4, max: 8 } },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    hint: { control: "text" },
    error: { control: "text" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-otp-input
        [label]="label"
        [length]="length"
        [(value)]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
        [hint]="hint"
        [error]="error"
      />
    `,
  }),
};

export const Incomplete: Story = {
  args: {
    value: "12",
    required: true,
    error: "Enter the full code.",
  },
  render: Playground.render,
};
