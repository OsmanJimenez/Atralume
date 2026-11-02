import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./speed-dial.component.stories";
export default {
  ...parent,
  title: "Actions/Speed Dial/Speed Dial Action",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
