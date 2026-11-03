import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within } from "storybook/test";
import { SelectionDemo } from "../../../../src/docs/phase4/selection-demo.component";
const meta = {
  title: "Overlays/Popover",
  component: SelectionDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [SelectionDemo] })],
  args: {
    family: "popover",
    disabled: false,
    loading: false,
    empty: false,
    error: false,
    multiple: false,
    large: false,
  },
} satisfies Meta<SelectionDemo>;
export default meta;
type Story = StoryObj<SelectionDemo>;
export const Playground: Story = {
  argTypes: {
    family: { control: false },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    empty: { control: "boolean" },
    error: { control: "boolean" },
    multiple: { control: "boolean" },
    large: { control: "boolean" },
  },
};
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Opening Taiga dropdown in Storybook iframe can throw TuiNoHostException;
    // assert the migrated atrPopover trigger host only.
    const trigger = canvas.getByRole("button", { name: "Open details" });
    await expect(trigger).toBeVisible();
    trigger.focus();
    await expect(canvasElement.ownerDocument.activeElement).toBe(trigger);
  },
};
