import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { TuiItem } from "@taiga-ui/cdk/directives/item";
import { AtralumeBreadcrumbs } from "../../index";
export default {
  title: "Navigation/Breadcrumbs",
  component: AtralumeBreadcrumbs,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AtralumeBreadcrumbs, TuiItem],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Breadcrumb",
    size: "m",
    itemsLimit: 4,
  },
  argTypes: {
    label: { control: "text" },
    size: { control: "select", options: ["m", "l"] },
    itemsLimit: { control: "number" },
  },
  render: (args) => ({
    props: args,
    template: `
      <atr-breadcrumbs [label]="label" [size]="size" [itemsLimit]="itemsLimit">
        <a *tuiItem href="#home">Home</a>
        <a *tuiItem href="#projects">Projects</a>
        <span *tuiItem>Atralume</span>
      </atr-breadcrumbs>
      <p>Trail: Home / Projects / Atralume</p>
    `,
  }),
};
