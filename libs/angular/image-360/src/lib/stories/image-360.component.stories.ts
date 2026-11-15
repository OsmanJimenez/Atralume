import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeImage360 } from "../../index";

const panorama = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1000'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop stop-color='%23112b45'/%3E%3Cstop offset='1' stop-color='%233a6d8c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='2000' height='1000' fill='url(%23sky)'/%3E%3Cpath d='M0 650C250 500 430 690 700 550s390 90 660-80 420 10 640-120v650H0Z' fill='%232f6b4a'/%3E%3Ccircle cx='1450' cy='270' r='90' fill='%23f7cf63'/%3E%3Ctext x='80' y='140' fill='white' font-family='system-ui,sans-serif' font-size='56'%3EShowroom 360%3C/text%3E%3Ctext x='80' y='210' fill='%23d7e7f5' font-family='system-ui,sans-serif' font-size='32'%3EArrastra · Gyro · VR%3C/text%3E%3C/svg%3E`;

export default {
  title: "Media/Image 360",
  component: AtralumeImage360,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeImage360] })],
  args: {
    src: panorama,
    alt: "Illustrated equirectangular mountain showroom",
    label: "Showroom panorámico",
    enableGyro: true,
    enableVr: true,
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<AtralumeImage360>;

type Story = StoryObj<AtralumeImage360>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Restablecer vista" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Acercar" }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Restablecer vista" }),
    );
  },
};

export const SensorsEnabled: Story = {
  name: "Sensors + VR",
  args: {
    label: "Suite con gyro y VR",
  },
};

export const DesktopOnly: Story = {
  name: "Sin sensores",
  args: {
    enableGyro: false,
    enableVr: false,
    label: "Solo drag y teclado",
  },
};
