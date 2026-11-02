import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeProgressSpinner } from "../../index";
export default {
  component: AtralumeProgressSpinner,
  title: "Atoms/Progress Spinner",
  decorators: [moduleMetadata({ imports: [AtralumeProgressSpinner] })],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Loading profile",
    value: 65,
    min: 0,
    max: 100,
    size: "medium",
    indeterminate: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    size: { control: "select", options: ["small", "medium", "large"] },
    indeterminate: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-progress-spinner [label]="label" [value]="indeterminate ? null : value" [min]="min" [max]="max" [size]="size"></atr-progress-spinner>',
  }),
  play: async ({ args, canvasElement }) => {
    const indicator = within(canvasElement).getByRole("progressbar", {
      name: args["label"],
    });
    if (args["indeterminate"]) {
      await expect(indicator).not.toHaveAttribute("aria-valuenow");
    } else {
      await expect(indicator).toHaveAttribute(
        "aria-valuenow",
        String(args["value"]),
      );
    }
  },
};

export const ReducedMotion: Story = {
  render: () => ({
    template:
      '<p>Enable reduced motion in your OS: the indicator pulses instead of rotating.</p><atr-progress-spinner label="Loading profile" />',
  }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><atr-progress-spinner label="Loading profile" /></section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><atr-progress-spinner label="Loading profile" /></section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><atr-progress-spinner label="Loading profile" /></section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-progress-spinner label="Loading profile" /><section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section><section data-atr-surface="elevated" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section><section data-atr-surface="transparent" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section><section data-atr-surface="glass" style="padding:2rem"><atr-progress-spinner label="Loading profile" /></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-progress-height:1rem"><atr-progress-spinner label="Loading profile" /></div>',
  }),
};
export const Changes: Story = {
  render: () => ({
    props: { value: 20 },
    template:
      '<button type="button" (click)="value = 80">Advance upload</button><atr-progress-spinner label="Uploading document" [value]="value" />',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "20",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Advance upload" }),
    );
    await expect(canvas.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "80",
    );
  },
};
