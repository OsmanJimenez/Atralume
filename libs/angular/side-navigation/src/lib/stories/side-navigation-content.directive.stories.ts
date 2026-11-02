import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./side-navigation.component.stories";
export default {
  ...parent,
  title: "Navigation/Side Navigation/Side Navigation Content",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
