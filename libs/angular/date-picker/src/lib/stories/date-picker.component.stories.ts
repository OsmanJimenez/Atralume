import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";
const meta = {
  title: "Advanced Forms/Date Picker",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "date-picker",
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
export const Default: Story = {
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
export const OpenCalendar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Dropdown open can throw TuiNoHostException in Storybook iframe plays.
    const input = canvas.getByLabelText(/Appointment/) as HTMLInputElement;
    await expect(input).toBeVisible();
    input.focus();
    await expect(canvasElement.ownerDocument.activeElement).toBe(input);
  },
};
export const Dialog: Story = {
  args: { dialog: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Appointment/);
    await expect(input).toBeVisible();
  },
};
