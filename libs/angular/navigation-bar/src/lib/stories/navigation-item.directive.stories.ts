import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./navigation-bar.directive.stories";
export default {
  ...parent,
  title: "Navigation/Navigation Bar/Navigation Item",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
