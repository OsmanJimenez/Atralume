import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { AtralumeContentSwitcher } from "../../index";

const meta = {
  title: "Molecules/Content Switcher",
  component: AtralumeContentSwitcher,
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({ imports: [AtralumeContentSwitcher] }),
  ],
  args: {
    size: "m" as const,
    activeItemIndex: 0,
    disabled: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m", "l"] },
    activeItemIndex: { control: { type: "number", min: 0, max: 2 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta<AtralumeContentSwitcher>;

export default meta;
type Story = StoryObj<AtralumeContentSwitcher>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-content-switcher
        [size]="size"
        [(activeItemIndex)]="activeItemIndex"
        [disabled]="disabled"
      >
        <button type="button">List</button>
        <button type="button">Board</button>
        <button type="button">Calendar</button>
      </atr-content-switcher>
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true, activeItemIndex: 1 },
  render: Playground.render,
};
