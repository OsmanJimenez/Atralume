import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AtralumeIcon,
  checkIcon,
  closeIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeIconButton } from "../../index";
export default {
  component: AtralumeIconButton,
  title: "Atoms/Icon Button",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeIconButton],
      providers: [provideAtralumeIcons([closeIcon, checkIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    appearance: "standard",
    size: "medium",
    disabled: false,
    onAction: fn(),
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    onAction: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<button atrIconButton type="button" aria-label="Close" [appearance]="appearance" [size]="size" [disabled]="disabled" (click)="onAction($event)"><atr-icon name="close" /></button>',
  }),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Close" }),
    );
    await expect(args["onAction"]).toHaveBeenCalledOnce();
  },
};

export const AccessibleNames: Story = {
  render: () => ({
    template:
      '<span id="close-label">Close panel</span><button atrIconButton type="button" aria-labelledby="close-label"><atr-icon name="close" /></button>',
  }),
};

export const Interaction: Story = {
  render: () => ({
    props: { clicks: 0 },
    template:
      '<button atrIconButton type="button" aria-label="Save" (click)="clicks=clicks+1"><atr-icon name="check" /></button><p role="status">Clicks: {{clicks}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("Clicks: 1");
  },
};
