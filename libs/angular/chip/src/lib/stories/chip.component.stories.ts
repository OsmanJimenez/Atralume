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
export const Default: Story = {
  render: () => ({
    template:
      '<atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set>',
  }),
};
export const Keyboard: Story = {
  ...Default,
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
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" style="padding:1rem"><atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-chip-shape:1.5rem;--atr-comp-chip-gap:1rem"><atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set></section>',
  }),
};
