import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeNavigationBar, AtralumeNavigationItem } from "../../index";
import {
  AtralumeIcon,
  menuIcon,
  provideAtralumeIcons,
  userIcon,
  checkIcon,
} from "@osmanjimenez/atralume/icon";
export default {
  title: "Navigation/Navigation Bar",
  component: AtralumeNavigationBar,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AtralumeNavigationBar, AtralumeNavigationItem, AtralumeIcon],
      providers: [provideAtralumeIcons([menuIcon, userIcon, checkIcon])],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Primary navigation",
  },
  argTypes: {
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-navigation-bar [label]="label"><a atrNavigationItem href="#home" active><atr-icon name="menu" aria-hidden="true" /><span>Home</span></a><a atrNavigationItem href="#projects"><atr-icon name="check" aria-hidden="true" /><span>Projects</span></a><a atrNavigationItem href="#profile"><atr-icon name="user" aria-hidden="true" /><span>Profile</span></a></atr-navigation-bar>',
  }),
};
