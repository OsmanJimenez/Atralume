import { pressKey } from "../../../../src/docs/phase3/keyboard";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within, waitFor } from "storybook/test";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";
export default {
  title: "Overlays/Menu",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({ template: '<atr-overlay-demo family="menu" />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = c.getByRole("button", { name: "Commands" });
    trigger.focus();
    await pressKey(canvasElement.ownerDocument, "ArrowDown");
    await waitFor(() =>
      expect(
        body.getByRole("menu", { name: "Profile commands" }),
      ).toBeVisible(),
    );
  },
};
export const Keyboard: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = c.getByRole("button", { name: "Commands" });
    trigger.focus();
    await pressKey(canvasElement.ownerDocument, "ArrowDown");
    await waitFor(() =>
      expect(
        body.getByRole("menu", { name: "Profile commands" }),
      ).toBeVisible(),
    );
    await pressKey(canvasElement.ownerDocument, "End");
    await expect(
      body.getByRole("menuitemradio", { name: "Compact" }),
    ).toHaveFocus();
    await pressKey(canvasElement.ownerDocument, "Home");
    await expect(body.getByRole("menuitem", { name: "Archive" })).toHaveFocus();
    await pressKey(canvasElement.ownerDocument, "m");
    await waitFor(() =>
      expect(
        body.getByRole("menuitem", { name: "More actions" }),
      ).toHaveFocus(),
    );
    await pressKey(canvasElement.ownerDocument, "ArrowRight");
    await waitFor(() =>
      expect(body.getByRole("menu", { name: "More actions" })).toBeVisible(),
    );
    await pressKey(canvasElement.ownerDocument, "Escape");
    await expect(
      body.getByRole("menu", { name: "Profile commands" }),
    ).toBeVisible();
    await pressKey(canvasElement.ownerDocument, "Escape");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(c.getByRole("button", { name: "Commands" })).toHaveFocus();
  },
};
export const Light: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-overlay-demo family="menu" /></section></div>',
  }),
};
export const Dark: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-overlay-demo family="menu" /></section></div>',
  }),
};
export const OnGlass: Story = {
  ...Default,
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-overlay-demo family="menu" /></section></div>',
  }),
};
export const NestedTheme: Story = {
  ...Default,
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem;--atr-comp-menu-shape:1.5rem"><atr-overlay-demo family="menu" /></section></section>',
  }),
};
