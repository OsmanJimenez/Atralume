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
export const Default: Story = {
  render: () => ({
    template:
      '<ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" style="padding:1rem"><ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-list-shape:1.5rem;--atr-comp-list-gap:1rem"><ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul></section>',
  }),
};
