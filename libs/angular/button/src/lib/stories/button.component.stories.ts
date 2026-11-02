import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeButton } from "../../index";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  arrowRightIcon,
} from "@atralume/angular/icon";
export default {
  component: AtralumeButton,
  title: "Atoms/Button",
  decorators: [
    moduleMetadata({
      imports: [AtralumeButton, AtralumeIcon],
      providers: [provideAtralumeIcons([checkIcon, arrowRightIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Continue",
    appearance: "filled",
    size: "medium",
    disabled: false,
    loading: false,
    fullWidth: false,
    onAction: fn(),
  },
  argTypes: {
    label: { control: "text" },
    appearance: {
      control: "select",
      options: ["filled", "tonal", "outlined", "text"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    onAction: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<button atrButton type="button" [appearance]="appearance" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth" (click)="onAction($event)">{{label}}</button>',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: args["label"] }));
    await expect(args["onAction"]).toHaveBeenCalledOnce();
  },
};
export const IconPlacement: Story = {
  render: () => ({
    template:
      '<button atrButton type="button"><atr-icon name="check" />Save</button><button atrButton type="button">Continue<atr-icon name="arrow-right" /></button>',
  }),
};
export const Navigation: Story = {
  render: () => ({ template: '<a atrButton href="#next">Continue</a>' }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><button atrButton type="button">Continue</button></section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><button atrButton type="button">Continue</button></section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><button atrButton type="button">Continue</button></section>',
  }),
};
export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><button atrButton type="button">Continue</button><section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><button atrButton type="button">Continue</button></section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><button atrButton type="button">Continue</button></section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><p>Standard</p><button atrButton type="button">Continue</button></section><section data-atr-surface="elevated" style="padding:2rem"><p>Elevated</p><button atrButton type="button">Continue</button></section><section data-atr-surface="transparent" style="padding:2rem"><p>Transparent</p><button atrButton type="button">Continue</button></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-button-container-color:var(--atr-sys-color-tertiary);--atr-comp-button-label-color:var(--atr-sys-color-on-tertiary);--atr-comp-button-container-radius:1rem"><button atrButton type="button">Continue</button></div>',
  }),
};
export const Interaction: Story = {
  render: () => ({
    props: { clicks: 0 },
    template:
      '<button atrButton type="button" aria-label="Save" (click)="clicks=clicks+1">Save</button><p role="status">Clicks: {{clicks}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("Clicks: 1");
  },
};
export const LoadingTransitions: Story = {
  render: () => ({
    props: { loading: false, clicks: 0 },
    template:
      '<button atrButton type="button" [loading]="loading" (click)="clicks=clicks+1">Save profile</button> <button type="button" (click)="loading=!loading">Toggle loading</button><p role="status">Clicks: {{clicks}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const action = canvas.getByRole("button", { name: "Save profile" });
    const toggle = canvas.getByRole("button", { name: "Toggle loading" });
    const width = action.getBoundingClientRect().width;
    await userEvent.click(toggle);
    await expect(action).toHaveAttribute("aria-busy", "true");
    await expect(action).toBeDisabled();
    await expect(action.getBoundingClientRect().width).toBe(width);
    await userEvent.click(action);
    await expect(canvas.getByRole("status")).toHaveTextContent("Clicks: 0");
    await userEvent.click(toggle);
    await expect(action).not.toBeDisabled();
    await userEvent.click(action);
    await expect(canvas.getByRole("status")).toHaveTextContent("Clicks: 1");
  },
};
