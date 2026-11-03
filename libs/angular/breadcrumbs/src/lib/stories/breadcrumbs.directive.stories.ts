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
  render: () => ({
    template: `
      <atr-breadcrumbs aria-label="Breadcrumb">
        <a *tuiItem href="#home">Home</a>
        <a *tuiItem href="#projects">Projects</a>
        <span *tuiItem>Atralume</span>
      </atr-breadcrumbs>
      <p>Trail: Home / Projects / Atralume</p>
    `,
  }),
};
