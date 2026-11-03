import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";

const meta = {
  title: "Workflows/Stepper",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "stepper",
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
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
    await userEvent.type(
      canvas.getByRole("textbox", { name: /Profile name/ }),
      "Alex",
    );
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Next" })).not.toBeDisabled(),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(await canvas.findByText("Value: step 2")).toBeVisible();
    await expect(canvas.getByRole("region", { name: /Review/ })).toHaveFocus();
  },
};
