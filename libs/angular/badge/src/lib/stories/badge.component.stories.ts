import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeIcon,
  checkIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeBadge } from "../../index";
export default {
  component: AtralumeBadge,
  title: "Atoms/Badge",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeBadge],
      providers: [provideAtralumeIcons([checkIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    content: "Active",
    tone: "success",
    appearance: "soft",
    size: "medium",
    count: null,
    max: 99,
    dot: false,
    label: "Status",
  },
  argTypes: {
    content: { control: "text" },
    tone: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "error", "info"],
    },
    appearance: {
      control: "select",
      options: ["filled", "soft", "outlined"],
    },
    size: { control: "select", options: ["small", "medium"] },
    count: { control: { type: "number", min: 0, max: 999 } },
    max: { control: { type: "number", min: 1, max: 999 } },
    dot: { control: "boolean" },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-badge [tone]="tone" [appearance]="appearance" [size]="size" [count]="count" [max]="max" [dot]="dot" [label]="label">{{content}}</atr-badge>',
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template:
      '<atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge>',
  }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> <section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section><section data-atr-surface="elevated" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section><section data-atr-surface="transparent" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section><section data-atr-surface="glass" style="padding:2rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-badge-shape:1rem"><atr-badge appearance="filled">filled</atr-badge> <atr-badge appearance="soft">soft</atr-badge> <atr-badge appearance="outlined">outlined</atr-badge> </div>',
  }),
};
