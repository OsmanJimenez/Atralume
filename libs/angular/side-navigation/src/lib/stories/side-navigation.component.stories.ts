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
const shell = (mode: string) =>
  `<button type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" mode="${mode}" [(opened)]="opened"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation>Application content remains usable beside the aside.</atr-side-navigation-container>`;
export const Playground: Story = {
  render: () => ({
    props: { opened: true },
    template: shell("side"),
  }),
};
export const Keyboard: Story = {
  render: () => ({
    props: { opened: false },
    template: shell("over"),
  }),
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
  render: () => ({
    props: { opened: true },
    template: shell("push"),
  }),
};
