import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { TuiTimelineItem } from "@taiga-ui/kit";
import { AtralumeTimeline } from "../../index";

const meta = {
  title: "Organisms/Timeline",
  component: AtralumeTimeline,
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({ imports: [AtralumeTimeline, TuiTimelineItem] }),
  ],
  args: {
    orientation: "horizontal" as const,
    max: 50,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    max: { control: { type: "number", min: 10, max: 200 } },
  },
} satisfies Meta<AtralumeTimeline>;

export default meta;
type Story = StoryObj<AtralumeTimeline>;

export const Playground: Story = {
  render: (args) => ({
    props: {
      ...args,
      first: [0, 12] as const,
      second: [20, 36] as const,
    },
    template: `
      <atr-timeline
        [orientation]="orientation"
        [max]="max"
        style="inline-size: min(100%, 24rem); min-block-size: 3rem"
      >
        <label
          tuiTimelineItem
          [draggable]="false"
          [resizable]="false"
          [value]="first"
          style="background: var(--atr-sys-color-primary); color: var(--atr-sys-color-on-primary)"
        >
          Kickoff
        </label>
        <label
          tuiTimelineItem
          [draggable]="false"
          [resizable]="false"
          [value]="second"
          style="background: var(--atr-sys-color-tertiary); color: var(--atr-sys-color-on-tertiary)"
        >
          Delivery
        </label>
      </atr-timeline>
    `,
  }),
};

export const Vertical: Story = {
  args: { orientation: "vertical", max: 50 },
  render: Playground.render,
};
