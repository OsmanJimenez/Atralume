import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeNavigationBar, AtralumeNavigationItem } from "../../index";
export default {
  title: "Navigation/Navigation Bar",
  component: AtralumeNavigationBar,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AtralumeNavigationBar, AtralumeNavigationItem],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  render: () => ({
    template:
      '<atr-navigation-bar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></atr-navigation-bar>',
  }),
};
