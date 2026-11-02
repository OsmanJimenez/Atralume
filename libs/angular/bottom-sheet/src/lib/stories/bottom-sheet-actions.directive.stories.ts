import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./bottom-sheet.service.stories";
export default {
  ...parent,
  title: "Overlays/Bottom Sheet/Bottom Sheet Actions",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
