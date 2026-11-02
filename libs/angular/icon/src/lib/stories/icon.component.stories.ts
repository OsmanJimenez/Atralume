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
export const Colors: Story = {
  render: () => ({
    template:
      '<atr-icon name="check" style="color:var(--atr-sys-color-tertiary)" />',
  }),
};
export const RTL: Story = {
  render: () => ({
    template:
      '<div dir="rtl"><atr-icon name="arrow-right" [decorative]="false" label="Next" /><atr-icon name="check" /></div>',
  }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> <section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section><section data-atr-surface="elevated" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section><section data-atr-surface="transparent" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section><section data-atr-surface="glass" style="padding:2rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-icon-size-medium:1rem"><atr-icon name="check" [decorative]="false" label="check" /> <atr-icon name="close" [decorative]="false" label="close" /> <atr-icon name="arrow-right" [decorative]="false" label="arrow-right" /> <atr-icon name="chevron-down" [decorative]="false" label="chevron-down" /> <atr-icon name="info" [decorative]="false" label="info" /> <atr-icon name="warning" [decorative]="false" label="warning" /> <atr-icon name="user" [decorative]="false" label="user" /> <atr-icon name="menu" [decorative]="false" label="menu" /> </div>',
  }),
};
