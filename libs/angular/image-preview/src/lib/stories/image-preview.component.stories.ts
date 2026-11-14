import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AtralumeImagePreview } from "../../index";

const images = [
  {
    src: "/images/laguna-siecha.png",
    alt: "Turquoise alpine lake surrounded by mountains",
    title: "Laguna de Siecha",
    description: "A quiet highland trail for an unhurried day outdoors.",
  },
  {
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 640'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%232b344a'/%3E%3Cstop offset='1' stop-color='%2358627a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='640' fill='url(%23g)'/%3E%3Ccircle cx='720' cy='160' r='64' fill='%23e8c453' opacity='0.85'/%3E%3Cpath d='M0 420 L220 300 L420 380 L640 260 L960 420 L960 640 L0 640 Z' fill='%2318733b' opacity='0.9'/%3E%3C/svg%3E",
    alt: "Stylized hillside landscape",
    title: "Second frame",
    description: "Use Next to move through the collection.",
  },
];

export default {
  title: "Media/Image preview",
  component: AtralumeImagePreview,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImagePreview] })],
  args: {
    images,
    label: "Image preview",
    triggerLabel: "Open image preview",
  },
  parameters: {
    layout: "centered",
  },
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
