import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeImageGallery } from "../../index";
const source = (color: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='${color.replace("#", "%23")}'/%3E%3C/svg%3E`;
const images = [
  {
    id: "blue",
    src: source("#415f78"),
    alt: "Blue study",
    title: "Blue study",
  },
  {
    id: "green",
    src: source("#39745d"),
    alt: "Green study",
    title: "Green study",
  },
];
export default {
  title: "Media/Image gallery",
  component: AtralumeImageGallery,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImageGallery] })],
  args: { images, label: "Color studies" },
} satisfies Meta<AtralumeImageGallery>;
type Story = StoryObj<AtralumeImageGallery>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByText("2 / 2")).toBeVisible();
  },
};
export const Empty: Story = { args: { images: [] } };
