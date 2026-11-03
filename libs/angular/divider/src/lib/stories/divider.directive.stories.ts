import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeDivider } from "../../index";
export default {
  component: AtralumeDivider,
  title: "Atoms/Divider",
  decorators: [
    moduleMetadata({
      imports: [AtralumeDivider],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    orientation: "horizontal",
    inset: "none",
    decorative: false,
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    inset: { control: "select", options: ["none", "start", "end", "both"] },
    decorative: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<div style="height:5rem;display:flex;align-items:center;gap:1rem"><span>First</span><div atrDivider style="flex:1" [orientation]="orientation" [inset]="inset" [decorative]="decorative"></div><span>Second</span></div>',
  }),
};

export const Semantic: Story = {
  render: () => ({ template: "<hr atrDivider />" }),
};
