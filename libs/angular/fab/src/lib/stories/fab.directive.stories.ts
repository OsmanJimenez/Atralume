import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeFab } from "../../index";
export default {
  title: "Actions/Floating Action Button",
  component: AtralumeFab,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeFab] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Create project",
    content: "+",
    appearance: "primary",
    size: "medium",
    extended: false,
    disabled: false,
    onAction: fn(),
  },
  argTypes: {
    label: { control: "text" },
    content: { control: "text" },
    appearance: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "surface"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    extended: { control: "boolean" },
    disabled: { control: "boolean" },
    onAction: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<button atrFab type="button" [attr.aria-label]="extended ? null : label" [appearance]="appearance" [size]="size" [extended]="extended" [disabled]="disabled" (click)="onAction($event)">{{extended ? label : content}}</button>',
  }),
  play: async ({ args, canvasElement }) => {
    const name = args["extended"] ? args["label"] : args["label"];
    await userEvent.click(
      within(canvasElement).getByRole("button", { name }),
    );
    await expect(args["onAction"]).toHaveBeenCalledOnce();
  },
};
