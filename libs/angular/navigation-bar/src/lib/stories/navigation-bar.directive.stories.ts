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
export const Default: Story = {
  render: () => ({
    template:
      '<nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-navigation-bar-shape:1.5rem;--atr-comp-navigation-bar-gap:1rem"><nav atrNavigationBar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></nav></section>',
  }),
};
