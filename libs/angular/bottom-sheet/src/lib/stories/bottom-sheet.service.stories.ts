import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { OverlayDemo } from "../../../../src/docs/phase3/overlay-demo.component";
export default {
  title: "Overlays/Bottom Sheet",
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [OverlayDemo] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  render: () => ({ template: '<atr-overlay-demo family="bottom-sheet" />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Open bottom sheet" }));
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Share profile" })).toBeVisible(),
    );
  },
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Open bottom sheet" }));
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Share profile" })).toBeVisible(),
    );
    await userEvent.click(body.getByRole("button", { name: "Share" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expect(
      c.getByRole("button", { name: "Open bottom sheet" }),
    ).toHaveFocus();
    await expect(c.getByText("Result: Shared profile")).toBeVisible();
  },
};
