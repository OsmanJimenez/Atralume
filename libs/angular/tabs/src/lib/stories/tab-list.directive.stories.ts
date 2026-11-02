import type { Meta, StoryObj } from "@storybook/angular";
import parent, * as ParentStories from "./tabs.component.stories";
export default { ...parent, title: "Navigation/Tabs/Tab List" } satisfies Meta;
export const Default: StoryObj = { ...ParentStories.Default };
