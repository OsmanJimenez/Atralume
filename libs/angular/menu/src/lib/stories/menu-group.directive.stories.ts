import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./menu.directive.stories";
export default { ...parent, title: "Overlays/Menu/Menu Group" } satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
