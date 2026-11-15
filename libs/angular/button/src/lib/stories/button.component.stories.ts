import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeButton } from "../../index";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  arrowRightIcon,
} from "@osmanjimenez/atralume/icon";
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

/** Visual matrix of appearances and feedback states for polish review. */
export const States: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:1rem;max-inline-size:40rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
          <button atrButton type="button" appearance="filled">Filled</button>
          <button atrButton type="button" appearance="tonal">Tonal</button>
          <button atrButton type="button" appearance="outlined">Outlined</button>
          <button atrButton type="button" appearance="text">Text</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
          <button atrButton type="button" disabled>Disabled</button>
          <button atrButton type="button" [loading]="true" aria-busy="true">Loading</button>
          <button atrButton type="button" appearance="outlined" [loading]="true" aria-busy="true">Loading outlined</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
          <button atrButton type="button" size="small">Small</button>
          <button atrButton type="button" size="medium">Medium</button>
          <button atrButton type="button" size="large">Large</button>
        </div>
      </div>
    `,
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
