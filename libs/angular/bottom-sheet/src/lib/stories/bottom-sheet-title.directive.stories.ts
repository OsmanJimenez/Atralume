import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./bottom-sheet.service.stories";
export default {
  ...parent,
  title: "Overlays/Bottom Sheet/Bottom Sheet Title",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
