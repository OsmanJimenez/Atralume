import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./list.directive.stories";
export default {
  ...parent,
  title: "Composition/List/List Supporting",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
