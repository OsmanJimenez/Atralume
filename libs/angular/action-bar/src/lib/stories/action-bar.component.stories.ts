import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeActionBar } from "../../index";

const meta = {
  title: "Organisms/Action Bar",
  component: AtralumeActionBar,
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({ imports: [AtralumeActionBar, AtralumeButton] }),
  ],
  args: {
    expanded: false,
    size: "m" as const,
  },
  argTypes: {
    expanded: { control: "boolean" },
    size: { control: "inline-radio", options: ["s", "m"] },
  },
} satisfies Meta<AtralumeActionBar>;

export default meta;
type Story = StoryObj<AtralumeActionBar>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-action-bar [expanded]="expanded" [size]="size">
        <strong>Selected: 3 of 12</strong>
        <button atrButton type="button" appearance="tonal">Archive</button>
        <button atrButton type="button" appearance="outlined">Delete</button>
      </atr-action-bar>
    `,
  }),
};

export const Expanded: Story = {
  args: { expanded: true, size: "s" },
  render: Playground.render,
};
