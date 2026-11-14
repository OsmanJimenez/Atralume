import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeImage } from "../../index";
const svg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23415f78'/%3E%3Ccircle cx='320' cy='180' r='110' fill='%23a7e5d1'/%3E%3C/svg%3E";
export default {
  title: "Media/Image",
  component: AtralumeImage,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImage] })],
  args: { src: svg, alt: "Abstract landscape", aspectRatio: "landscape" },
} satisfies Meta<AtralumeImage>;
type Story = StoryObj<AtralumeImage>;
export const Default: Story = {};
export const PreviewIntent: Story = {
  args: { previewable: true },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open image preview" }),
    );
    await expect(canvasElement.querySelector("atr-image")).toBeTruthy();
  },
};
export const Error: Story = {
  args: { src: "missing-image.svg", fallbackSrc: "also-missing.svg" },
};
