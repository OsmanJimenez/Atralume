import type { Meta, StoryObj } from "@storybook/angular";
import { IconExplorerComponent } from "../components/icon-explorer/icon-explorer.component";

const meta: Meta<IconExplorerComponent> = {
  title: "Foundations/Icon Explorer",
  component: IconExplorerComponent,
  parameters: {
    layout: "padded",
  },
  tags: ["!autodocs"],
};

export default meta;

type Story = StoryObj<IconExplorerComponent>;

export const Gallery: Story = {
  name: "Gallery",
  render: () => ({
    moduleMetadata: {
      imports: [IconExplorerComponent],
    },
    template: `<atr-doc-icon-explorer />`,
  }),
};
