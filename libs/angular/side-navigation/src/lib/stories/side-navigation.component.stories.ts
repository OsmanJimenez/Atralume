import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeSideNavigationContainer,
  AtralumeSideNavigation,
  AtralumeSideNavigationHeader,
  AtralumeSideNavigationContent,
  AtralumeSideNavigationItem,
  AtralumeSideNavigationGroup,
  AtralumeSideNavigationLabel,
} from "../../index";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
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
        AtralumeSideNavigationContent,
        AtralumeSideNavigationItem,
        AtralumeSideNavigationGroup,
        AtralumeSideNavigationLabel,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container>',
  }),
};
export const Keyboard: Story = {
  render: () => ({
    props: { opened: false, mode: "over" },
    template:
      '<button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container>',
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    const trigger = c.getByRole("button", { name: "Toggle navigation" });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Workspace" })).toBeVisible(),
    );
    await pressKey(canvasElement.ownerDocument, "Escape");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
export const Light: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    props: { opened: true, mode: "side" },
    template:
      '<section style="--atr-comp-side-navigation-shape:1.5rem;--atr-comp-side-navigation-gap:1rem"><button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container></section>',
  }),
};
export const Push: Story = {
  render: () => ({
    props: { opened: true, mode: "push" },
    template:
      '<button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container>',
  }),
};
