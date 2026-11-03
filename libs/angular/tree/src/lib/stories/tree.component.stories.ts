import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeTree,
  type AtralumeTreeNode,
} from "../components/tree/tree.component";
const nodes: AtralumeTreeNode<string>[] = [
  {
    value: "design",
    label: "Design",
    children: [
      { value: "tokens", label: "Tokens" },
      { value: "components", label: "Components" },
    ],
  },
  { value: "docs", label: "Documentation" },
];
const meta = {
  title: "Data/Tree",
  component: AtralumeTree,
  decorators: [moduleMetadata({ imports: [AtralumeTree] })],
  args: { label: "Project files", nodes, expandAll: true },
} satisfies Meta<AtralumeTree<string>>;
export default meta;
type Story = StoryObj<AtralumeTree<string>>;
export const Playground: Story = {
  args: { selectionMode: "single", expanded: ["design"] },
  argTypes: {
    label: { control: "text" },
    selectionMode: { control: "select", options: ["single", "multiple"] },
    expanded: { control: false },
    nodes: { control: false },
  },
};
