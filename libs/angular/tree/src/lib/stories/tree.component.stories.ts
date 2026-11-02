import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeTree, type AtralumeTreeNode } from "../components/tree/tree.component";
const nodes: AtralumeTreeNode<string>[] = [{ value: "design", label: "Design", children: [{ value: "tokens", label: "Tokens" }, { value: "components", label: "Components" }] }, { value: "docs", label: "Documentation" }];
const meta = { title: "Data/Tree", component: AtralumeTree, decorators: [moduleMetadata({ imports: [AtralumeTree] })], args: { label: "Project files", nodes } } satisfies Meta<AtralumeTree<string>>;
export default meta; type Story = StoryObj<AtralumeTree<string>>;
export const Default: Story = {};
export const Multiple: Story = { args: { selectionMode: "multiple", expanded: ["design"] } };
export const Loading: Story = { args: { nodes: [{ value: "remote", label: "Remote folder", loading: true }] } };
