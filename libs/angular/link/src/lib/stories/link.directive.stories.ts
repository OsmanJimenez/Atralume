import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AtralumeIcon,
  arrowRightIcon,
  infoIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeLink } from "../../index";
export default {
  component: AtralumeLink,
  title: "Atoms/Link",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeLink],
      providers: [provideAtralumeIcons([arrowRightIcon, infoIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Documentation",
    href: "#documentation",
    appearance: "inline",
    underline: "always",
    onNavigate: fn(),
  },
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    appearance: { control: "select", options: ["inline", "standalone"] },
    underline: { control: "select", options: ["always", "hover"] },
    onNavigate: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<a atrLink [href]="href" [appearance]="appearance" [underline]="underline" (click)="onNavigate($event); $event.preventDefault()">{{label}}</a>',
  }),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("link", { name: args["label"] }),
    );
    await expect(args["onNavigate"]).toHaveBeenCalledOnce();
  },
};

export const IconPlacement: Story = {
  render: () => ({
    template:
      '<a atrLink appearance="standalone" href="#info"><atr-icon name="info" />About this page</a> <a atrLink appearance="standalone" href="#next">Continue<atr-icon name="arrow-right" /></a>',
  }),
};

export const Interaction: Story = {
  render: () => ({
    props: { activated: false },
    template:
      '<a atrLink href="#keyboard-target" (click)="activated=true; $event.preventDefault()">Documentation</a><p role="status">Activated: {{activated}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Activated: true",
    );
  },
};
