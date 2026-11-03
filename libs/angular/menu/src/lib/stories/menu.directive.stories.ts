import { pressKey } from "../../../../src/docs/phase3/keyboard";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within, waitFor } from "storybook/test";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";
export default {
  title: "Overlays/Menu",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  render: () => ({ template: '<atr-overlay-demo family="menu" />' })
};
