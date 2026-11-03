import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "../../index";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Navigation/Tabs",
  component: AtralumeTabs,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [AtralumeTabs, AtralumeTabList, AtralumeTab, AtralumeTabPanel],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  render: () => ({
    template:
      '<atr-tabs label="Profile sections"><tui-tabs atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></tui-tabs><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs>',
  }),
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const first = c.getByRole("tab", { name: "Overview" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    const second = c.getByRole("tab", { name: "Activity" });
    await expect(second).toHaveFocus();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(c.getByRole("tabpanel", { name: "Activity" })).toBeVisible();
    await userEvent.keyboard("{End}");
    await expect(second).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(first).toHaveFocus();
  },
};
export const ManualActivation: Story = {
  render: () => ({
    template:
      '<atr-tabs label="Profile sections" activation="manual"><tui-tabs atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></tui-tabs><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs>',
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const first = c.getByRole("tab", { name: "Overview" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    await expect(c.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
