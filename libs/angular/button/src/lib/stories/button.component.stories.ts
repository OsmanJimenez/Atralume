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
