import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./breadcrumbs.directive.stories";
export default {
  ...parent,
  title: "Navigation/Breadcrumbs/Breadcrumb Separator",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
