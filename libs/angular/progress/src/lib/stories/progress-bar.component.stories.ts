import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeProgressBar } from "../../index";
export default {
  component: AtralumeProgressBar,
  title: "Atoms/Progress Bar",
  decorators: [moduleMetadata({ imports: [AtralumeProgressBar] })],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Uploading document",
    value: 65,
    min: 0,
    max: 100,
    indeterminate: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    indeterminate: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-progress-bar [label]="label" [value]="indeterminate ? null : value" [min]="min" [max]="max"></atr-progress-bar>',
  })
};

