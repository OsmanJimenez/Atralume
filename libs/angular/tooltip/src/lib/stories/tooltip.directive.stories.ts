import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";
export default {
  title: "Overlays/Tooltip",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: { family: "tooltip" },
  argTypes: { family: { control: false } },
  render: (args) => ({
    props: args,
    template: '<atr-overlay-demo [family]="family" />',
  }),
};
