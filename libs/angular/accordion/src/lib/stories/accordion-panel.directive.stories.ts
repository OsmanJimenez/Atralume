import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./accordion.component.stories";
export default {
  ...parent,
  title: "Composition/Accordion/Accordion Panel",
} satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
