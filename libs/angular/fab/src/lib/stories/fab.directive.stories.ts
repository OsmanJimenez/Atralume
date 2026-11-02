import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeFab } from "../../index";
export default {
  title: "Actions/Floating Action Button",
  component: AtralumeFab,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeFab] })],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<button atrFab type="button" aria-label="Create project">+</button>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><button atrFab type="button" aria-label="Create project">+</button></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><button atrFab type="button" aria-label="Create project">+</button></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><button atrFab type="button" aria-label="Create project">+</button></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><button atrFab type="button" aria-label="Create project">+</button></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-fab-shape:1.5rem;--atr-comp-fab-gap:1rem"><button atrFab type="button" aria-label="Create project">+</button></section>',
  }),
};
export const Appearances: Story = {
  render: () => ({
    template:
      '<button atrFab type="button" aria-label="Create primary" appearance="primary" extended>Create project</button> <button atrFab type="button" aria-label="Create secondary" appearance="secondary" extended>Create project</button> <button atrFab type="button" aria-label="Create tertiary" appearance="tertiary" extended>Create project</button> <button atrFab type="button" aria-label="Create surface" appearance="surface" extended>Create project</button>',
  }),
};
export const Sizes: Story = {
  render: () => ({
    template:
      '<button atrFab type="button" aria-label="small create" size="small">+</button> <button atrFab type="button" aria-label="medium create" size="medium">+</button> <button atrFab type="button" aria-label="large create" size="large">+</button><button atrFab type="button" disabled aria-label="Unavailable create">+</button>',
  }),
};
