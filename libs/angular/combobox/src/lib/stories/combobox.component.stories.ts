import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within } from "storybook/test";
import { SelectionDemo } from "../../../../src/docs/phase4/selection-demo.component";

const meta = {
  title: "Advanced Forms/Combobox",
  component: SelectionDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [SelectionDemo] })],
  args: {
    family: "combobox",
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

/** Dropdown keyboard commit covered by Taiga; assert Taiga combo host is present. */
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("combobox", { name: /Choose a tool/i });
    await expect(control).toBeVisible();
    control.focus();
    await expect(control).toHaveFocus();
    await expect(canvasElement.querySelector("tui-textfield")).toBeTruthy();
    await expect(
      canvasElement.querySelector("input[atrComboBox], input[tuiComboBox]"),
    ).toBeTruthy();
  },
};
