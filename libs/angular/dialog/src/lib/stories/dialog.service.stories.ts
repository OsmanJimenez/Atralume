import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";

export default {
  title: "Overlays/Dialog",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;

type Story = StoryObj;

/** Opens via the demo button; Taiga dialog portals outside the canvas. */
export const Playground: Story = {
  args: { family: "dialog" },
  argTypes: { family: { control: false } },
  render: (args) => ({
    props: args,
    template: '<atr-overlay-demo [family]="family" />',
  }),
};
