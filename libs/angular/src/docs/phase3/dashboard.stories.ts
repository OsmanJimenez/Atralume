import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { DashboardDemo } from "./dashboard-demo.component";
export default {
  title: "Atralume/Application Example",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [DashboardDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-sys-shape-large)"><atr-dashboard-demo /></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-sys-shape-large)"><atr-dashboard-demo /></section></div>',
  }),
};
export const Glass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem;border-radius:var(--atr-sys-shape-large)"><atr-dashboard-demo /></section></div>',
  }),
};
