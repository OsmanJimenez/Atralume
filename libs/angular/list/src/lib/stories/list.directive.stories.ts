import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
  AtralumeListTrailing,
} from "../../index";
export default {
  title: "Composition/List",
  component: AtralumeList,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeList,
        AtralumeListItem,
        AtralumeListHeadline,
        AtralumeListSupporting,
        AtralumeListTrailing,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    density: "comfortable",
  },
  argTypes: {
    density: { control: "select", options: ["comfortable", "compact"] },
  },
  render: (args) => ({
    props: args,
    template:
      '<ul atrList [density]="density"><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul>',
  }),
};
