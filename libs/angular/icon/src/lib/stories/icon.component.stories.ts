import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  closeIcon,
  arrowRightIcon,
  chevronDownIcon,
  infoIcon,
  warningIcon,
  userIcon,
  menuIcon,
} from "../../index";
export default {
  component: AtralumeIcon,
  title: "Atoms/Icon",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon],
      providers: [
        provideAtralumeIcons([
          checkIcon,
          closeIcon,
          arrowRightIcon,
          chevronDownIcon,
          infoIcon,
          warningIcon,
          userIcon,
          menuIcon,
        ]),
      ],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    name: "check",
    size: "medium",
    decorative: true,
    label: "Check icon",
  },
  argTypes: {
    name: {
      control: "select",
      options: [
        "check",
        "close",
        "arrow-right",
        "chevron-down",
        "info",
        "warning",
        "user",
        "menu",
      ],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large", 48],
    },
    decorative: { control: "boolean" },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-icon [name]="name" [size]="size" [decorative]="decorative" [label]="label"></atr-icon>',
  }),
};

export const Gallery: Story = {
  render: () => ({
    template:
      '<atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> ',
  }),
};

export const TaigaBridge: Story = {
  name: "Taiga bridge",
  render: () => ({
    template:
      '<atr-icon engine="tui" name="@tui.check" [decorative]="false" label="Taiga check" /> <atr-icon engine="tui" name="@tui.heart" [decorative]="false" label="Taiga heart" />',
  }),
};
