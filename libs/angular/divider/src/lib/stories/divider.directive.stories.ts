import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeDivider } from "../../index";
export default {
  component: AtralumeDivider,
  title: "Atoms/Divider",
  decorators: [
    moduleMetadata({
      imports: [AtralumeDivider],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    orientation: "horizontal",
    inset: "none",
    decorative: false,
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    inset: { control: "select", options: ["none", "start", "end", "both"] },
    decorative: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<div style="height:5rem;display:flex;align-items:center;gap:1rem"><span>First</span><div atrDivider style="flex:1" [orientation]="orientation" [inset]="inset" [decorative]="decorative"></div><span>Second</span></div>',
  }),
};

export const Semantic: Story = {
  render: () => ({ template: "<hr atrDivider />" }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><p>Before</p><hr atrDivider /><p>After</p></section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><p>Before</p><hr atrDivider /><p>After</p></section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><p>Before</p><hr atrDivider /><p>After</p></section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p><section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section><section data-atr-surface="elevated" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section><section data-atr-surface="transparent" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section><section data-atr-surface="glass" style="padding:2rem"><p>Before</p><hr atrDivider /><p>After</p></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-divider-inset:1rem"><p>Before</p><hr atrDivider /><p>After</p></div>',
  }),
};
