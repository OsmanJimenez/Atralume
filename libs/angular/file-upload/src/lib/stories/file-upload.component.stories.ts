import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";
const meta = {
  title: "Advanced Forms/File Upload",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "file-upload",
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
    await userEvent.upload(
      canvas.getByLabelText("Attachments"),
      new File(["Notes"], "notes.txt", { type: "text/plain" }),
    );
    await expect(await canvas.findByText("Value: 1 files")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove notes.txt" }),
    );
    await expect(await canvas.findByText("Value: 0 files")).toBeVisible();
  },
};
export const RejectedFiles: Story = {
  args: { error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(
      canvas.getByLabelText("Attachments"),
      new File(["Image"], "image.png", { type: "image/png" }),
      { applyAccept: false },
    );
  },
};
