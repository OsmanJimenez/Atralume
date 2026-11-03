import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeIcon,
  checkIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeBadge } from "../../index";
export default {
  component: AtralumeBadge,
  title: "Atoms/Badge",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeBadge],
      providers: [provideAtralumeIcons([checkIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    content: "Active",
    tone: "success",
    appearance: "soft",
    size: "medium",
    count: null,
    max: 99,
    dot: false,
    label: "Status",
  },
  argTypes: {
    content: { control: "text" },
    tone: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error", "info"],
    },
    appearance: {
      control: "select",
      options: ["filled", "soft", "outlined"],
    },
    size: { control: "select", options: ["small", "medium"] },
    count: { control: { type: "number", min: 0, max: 999 } },
    max: { control: { type: "number", min: 1, max: 999 } },
    dot: { control: "boolean" },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-badge [tone]="tone" [appearance]="appearance" [size]="size" [count]="count" [max]="max" [dot]="dot" [label]="label">{{content}}</atr-badge>',
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template:
      '<atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge>',
  }),
};
