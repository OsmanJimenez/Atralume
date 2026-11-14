import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeSideNavigationContainer,
  AtralumeSideNavigation,
  AtralumeSideNavigationHeader,
  AtralumeSideNavigationItem,
  AtralumeSideNavigationGroup,
  AtralumeSideNavigationLabel,
} from "../../index";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeIcon,
  menuIcon,
  provideAtralumeIcons,
  userIcon,
} from "@osmanjimenez/atralume/icon";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Navigation/Side Navigation",
  component: AtralumeSideNavigation,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeSideNavigationContainer,
        AtralumeSideNavigation,
        AtralumeSideNavigationHeader,
        AtralumeSideNavigationItem,
        AtralumeSideNavigationGroup,
        AtralumeSideNavigationLabel,
        AtralumeButton,
        AtralumeIcon,
      ],
      providers: [provideAtralumeIcons([menuIcon, userIcon])],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
const shell = () =>
  `<div class="atr-sidenav-story-toolbar" style="display:flex;align-items:center;gap:0.75rem;margin-block-end:0.75rem"><button atrButton appearance="outlined" type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button></div><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" [label]="label" [mode]="mode" [(opened)]="opened" [collapsed]="collapsed"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><atr-icon name="menu" aria-hidden="true" /><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><atr-icon name="user" aria-hidden="true" /><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation>Application content remains usable beside the aside.</atr-side-navigation-container>`;
export const Playground: Story = {
  args: {
    mode: "side",
    opened: true,
    collapsed: false,
    label: "Workspace",
  },
  argTypes: {
    mode: { control: "select", options: ["side", "over", "push"] },
    opened: { control: "boolean" },
    collapsed: { control: "boolean" },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template: shell(),
  }),
};
export const Keyboard: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    mode: "over",
    opened: false,
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Toggle navigation" });
    await userEvent.click(trigger);
    await expect(
      c.getByRole("complementary", { name: "Workspace" }),
    ).toBeVisible();
    await userEvent.click(trigger);
    await expect(
      c.queryByRole("complementary", { name: "Workspace" }),
    ).toBeNull();
  },
};
export const Push: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    mode: "push",
    opened: true,
  },
};
