import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
const meta = {
  title: "Advanced Forms/Slider",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "slider",
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
    const document = canvasElement.ownerDocument;
    const slider = canvas.getByRole("slider");
    slider.focus();
    await pressKey(document, "PageUp");
    await expect(await canvas.findByText("Value: 60")).toBeVisible();
  },
};
