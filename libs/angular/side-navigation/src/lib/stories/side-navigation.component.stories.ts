import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeSideNavigationContainer,
  AtralumeSideNavigation,
  AtralumeSideNavigationHeader,
  AtralumeSideNavigationItem,
  AtralumeSideNavigationGroup,
  AtralumeSideNavigationLabel,
} from "../../index";
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
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
const shell = () =>
  `<button type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" [label]="label" [mode]="mode" [(opened)]="opened" [collapsed]="collapsed"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation>Application content remains usable beside the aside.</atr-side-navigation-container>`;
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
