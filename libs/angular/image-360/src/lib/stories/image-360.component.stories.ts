import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeImage360 } from "../../index";

const panorama = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1000'%3E%3Crect width='2000' height='1000' fill='%231a5472'/%3E%3Cpath d='M0 650C250 500 430 690 700 550s390 90 660-80 420 10 640-120v650H0Z' fill='%233e885a'/%3E%3Ccircle cx='1450' cy='270' r='90' fill='%23f7cf63'/%3E%3Ctext x='100' y='150' fill='white' font-family='sans-serif' font-size='64'%3EPanoramic scene%3C/text%3E%3C/svg%3E`;

export default {
  title: "Media/Image 360",
  component: AtralumeImage360,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImage360] })],
  args: {
    src: panorama,
    alt: "Illustrated equirectangular mountain landscape",
    label: "Mountain panorama",
  },
} satisfies Meta<AtralumeImage360>;

type Story = StoryObj<AtralumeImage360>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Girar a la derecha" }));
    await expect(canvas.getByRole("button", { name: "Restablecer" })).toBeVisible();
  },
};
