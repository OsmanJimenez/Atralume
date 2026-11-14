import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeEmptyState } from "../../index";
export default {
  title: "Exploration/Empty state",
  component: AtralumeEmptyState,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({ imports: [AtralumeEmptyState, AtralumeButton] }),
  ],
  args: {
    title: "No matching items",
    description: "Adjust the filters or clear the search to continue.",
  },
} satisfies Meta<AtralumeEmptyState>;
type Story = StoryObj<AtralumeEmptyState>;
export const Default: Story = {
  render: (args) => ({
    props: args,
    template:
      '<atr-empty-state [title]="title" [description]="description"><button atrEmptyStatePrimary atrButton type="button">Clear filters</button></atr-empty-state>',
  }),
};
export const Compact: Story = {
  args: { appearance: "compact", title: "No saved items", description: null },
};
