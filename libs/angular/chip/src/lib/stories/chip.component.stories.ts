import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeChip, AtralumeChipSet } from "../../index";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Composition/Chip",
  component: AtralumeChip,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeChip, AtralumeChipSet] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  render: () => ({
    template:
      '<atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set>',
  }),
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const angular = c.getByRole("button", { name: "Angular" });
    await userEvent.click(angular);
    await expect(angular).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(c.getByRole("button", { name: "CSS" }));
    await expect(angular).toHaveAttribute("aria-pressed", "false");
    angular.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(c.getByRole("button", { name: "CSS" })).toHaveFocus();
    await userEvent.click(c.getByRole("button", { name: "Remove Tokens" }));
  },
};
