import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./card.component.stories";
export default {
  ...parent,
  title: "Composition/Card/Card Header",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
