import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";
export default {
  title: "Feedback/Snackbar",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({ template: '<atr-overlay-demo family="snackbar" />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Show notification" }));
    await waitFor(() => expect(body.getByText("Profile saved")).toBeVisible());
  },
};
export const Keyboard: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Show notification" }));
    await waitFor(() => expect(body.getByText("Profile saved")).toBeVisible());
    await userEvent.click(body.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(body.queryByText("Profile saved")).toBeNull());
    await expect(c.getByText("Result: action")).toBeVisible();
  },
};
export const Light: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-overlay-demo family="snackbar" /></section></div>',
  }),
};
export const Dark: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-overlay-demo family="snackbar" /></section></div>',
  }),
};
export const OnGlass: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-overlay-demo family="snackbar" /></section></div>',
  }),
};
export const NestedTheme: Story = {
  ...Default,
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem;--atr-comp-snackbar-shape:1.5rem"><atr-overlay-demo family="snackbar" /></section></section>',
  }),
};
