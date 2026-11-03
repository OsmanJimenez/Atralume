import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { SelectionDemo } from "../../../../src/docs/phase4/selection-demo.component";

const meta = {
  title: "Overlays/Command Palette",
  component: SelectionDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [SelectionDemo] })],
  args: {
    family: "command-palette",
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
