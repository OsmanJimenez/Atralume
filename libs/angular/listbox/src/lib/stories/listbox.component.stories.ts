import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within } from "storybook/test";
import { SelectionDemo } from "../../../../src/docs/phase4/selection-demo.component";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
const meta = {
  title: "Advanced Forms/Listbox",
  component: SelectionDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [SelectionDemo] })],
  args: {
    family: "listbox",
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
    const document = canvasElement.ownerDocument;
    const options = canvas.getAllByRole("option");
    options[0].focus();
    await pressKey(document, "ArrowDown");
    await pressKey(document, "Enter");
    await expect(await canvas.findByText("Selected: b")).toBeVisible();
  },
};
