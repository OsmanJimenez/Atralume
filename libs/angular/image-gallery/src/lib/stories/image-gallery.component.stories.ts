import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeImageGallery } from "../../index";

const source = (color: string, label: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 640'%3E%3Crect width='960' height='640' fill='${color.replace("#", "%23")}'/%3E%3Ctext x='48' y='560' fill='white' font-size='42' font-family='Arial'>${label}%3C/text%3E%3C/svg%3E`;

const images = [
  {
    id: "lake",
    src: source("#2f5d62", "Lake"),
    alt: "Turquoise alpine lake surrounded by mountains",
    title: "Laguna de Siecha",
    description: "A quiet highland trail for an unhurried day outdoors.",
    location: "Cundinamarca",
    tags: ["nature", "easy"],
  },
  {
    id: "forest",
    src: source("#3d6b4f", "Forest"),
    alt: "Sunlight entering a dense green forest",
    title: "Bosque de Niebla",
    description: "Soft light, birdlife and a forest path after the rain.",
    location: "Boyacá",
    tags: ["nature", "weekend"],
  },
  {
    id: "coast",
    src: source("#2f6f8f", "Coast"),
    alt: "Waves breaking on a bright tropical coast",
    title: "Cabo de la Vela",
    description: "Salt air, long horizons and an early morning swim.",
    location: "La Guajira",
    tags: ["water", "weekend"],
  },
];

export default {
  title: "Media/Image gallery",
  component: AtralumeImageGallery,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImageGallery] })],
  args: { images, label: "Recommended destinations" },
} satisfies Meta<AtralumeImageGallery>;

type Story = StoryObj<AtralumeImageGallery>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByText("2 / 3")).toBeVisible();
  },
};

export const Mosaic: Story = {
  args: {
    layout: "mosaic",
    showThumbnails: false,
  },
};

export const Empty: Story = { args: { images: [] } };
