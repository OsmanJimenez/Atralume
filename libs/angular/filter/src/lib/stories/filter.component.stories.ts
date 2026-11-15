import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeFilter } from "../../index";
const options = [
  { value: "recent", label: "Recent" },
  { value: "saved", label: "Saved", badge: 3 },
  { value: "archived", label: "Archived", disabled: true },
];
export default {
  title: "Exploration/Filter",
  component: AtralumeFilter,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeFilter] })],
  args: { label: "Content status", options },
} satisfies Meta<AtralumeFilter<string>>;
type Story = StoryObj<AtralumeFilter<string>>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Taiga chip checkboxes use pointer-events:none on the input; click the label host.
    const recent = canvasElement.querySelector(
      "label.t-item",
    ) as HTMLLabelElement | null;
    await expect(recent).toBeTruthy();
    await userEvent.click(recent!);
    await expect(canvas.getByRole("button", { name: "Clear" })).toBeEnabled();
  },
};
export const Compact: Story = { args: { size: "s" } };
