import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeProgressSpinner } from "../../index";
export default {
  component: AtralumeProgressSpinner,
  title: "Atoms/Progress Spinner",
  decorators: [moduleMetadata({ imports: [AtralumeProgressSpinner] })],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Loading profile",
    value: 65,
    min: 0,
    max: 100,
    size: "medium",
    indeterminate: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    size: { control: "select", options: ["small", "medium", "large"] },
    indeterminate: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-progress-spinner [label]="label" [value]="indeterminate ? null : value" [min]="min" [max]="max" [size]="size"></atr-progress-spinner>',
  })
};

