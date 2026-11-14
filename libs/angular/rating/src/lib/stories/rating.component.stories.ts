import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeRating } from "../../index";

const meta = {
  title: "Advanced Forms/Rating",
  component: AtralumeRating,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeRating] })],
  args: {
    label: "Score",
    max: 5,
    value: 3,
    disabled: false,
    readonly: false,
    required: false,
  },
  argTypes: {
    label: { control: "text" },
    max: { control: { type: "number", min: 1, max: 10 } },
    value: { control: { type: "number", min: 0, max: 10 } },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<AtralumeRating>;

export default meta;
type Story = StoryObj<AtralumeRating>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-rating
        [label]="label"
        [max]="max"
        [(value)]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
      />
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true, value: 4 },
  render: Playground.render,
};

export const Readonly: Story = {
  args: { readonly: true, value: 5 },
  render: Playground.render,
};
