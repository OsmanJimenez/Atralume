import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeSkeleton } from "../../index";
export default {
  title: "Composition/Skeleton",
  component: AtralumeSkeleton,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeSkeleton] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    appearance: "text",
    animation: "pulse",
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["text", "circle", "rectangle", "rounded"],
    },
    animation: {
      control: "select",
      options: ["pulse", "shimmer", "none"],
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-skeleton [appearance]="appearance" [animation]="animation" />',
  }),
};

export const Composition: Story = {
  render: () => ({
    template:
      '<section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section>',
  }),
};
