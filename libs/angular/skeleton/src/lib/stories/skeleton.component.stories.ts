import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeSkeleton } from "../../index";
export default {
  title: "Composition/Skeleton",
  component: AtralumeSkeleton,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeSkeleton] })],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" style="padding:1rem"><section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-skeleton-shape:1.5rem;--atr-comp-skeleton-gap:1rem"><section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section></section>',
  }),
};
