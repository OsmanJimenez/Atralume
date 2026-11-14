import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AtralumeImagePreview } from "../../index";
const images = [
  {
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23415f78'/%3E%3C/svg%3E",
    alt: "Blue abstract image",
    title: "Abstract study",
    description: "A deterministic preview image.",
  },
];
export default {
  title: "Media/Image preview",
  component: AtralumeImagePreview,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImagePreview] })],
  args: { images, label: "Image preview" },
} satisfies Meta<AtralumeImagePreview>;
type Story = StoryObj<AtralumeImagePreview>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open image preview" }),
    );
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByRole("dialog", {
          name: "Image preview",
        }),
      ).toBeVisible(),
    );
  },
};
export const Disabled: Story = { args: { disabled: true } };
