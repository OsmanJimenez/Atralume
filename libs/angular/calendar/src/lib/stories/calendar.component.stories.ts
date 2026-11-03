import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";
const meta = {
  title: "Advanced Forms/Calendar",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "calendar",
    disabled: false,
    readOnly: false,
    range: false,
    vertical: false,
    twelveHour: false,
    seconds: false,
    error: false,
    uploading: false,
    dialog: false,
    previews: false,
  },
} satisfies Meta<AdvancedInputDemo>;
export default meta;
type Story = StoryObj<AdvancedInputDemo>;
export const Playground: Story = {
  argTypes: {
    family: { control: false },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    range: { control: "boolean" },
    vertical: { control: "boolean" },
    twelveHour: { control: "boolean" },
    seconds: { control: "boolean" },
    error: { control: "boolean" },
    uploading: { control: "boolean" },
    dialog: { control: "boolean" },
    previews: { control: "boolean" },
  },
};
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvasElement.querySelectorAll(
      '[automation-id="tui-calendar-sheet__cell"]',
    );
    const target = Array.from(cells).find(
      (cell) =>
        cell.textContent?.trim() === "5" &&
        !cell.classList.contains("t-cell_unavailable"),
    );
    await expect(target).toBeTruthy();
    await userEvent.click(target as HTMLElement);
    await expect(await canvas.findByText("Value: 2026-11-05")).toBeVisible();
  },
};
