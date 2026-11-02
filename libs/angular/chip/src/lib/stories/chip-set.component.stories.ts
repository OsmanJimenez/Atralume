import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./chip.component.stories";
export default { ...parent, title: "Composition/Chip/Chip Set" } satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
