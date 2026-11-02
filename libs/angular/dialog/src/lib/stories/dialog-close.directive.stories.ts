import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./dialog.service.stories";
export default {
  ...parent,
  title: "Overlays/Dialog/Dialog Close",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
