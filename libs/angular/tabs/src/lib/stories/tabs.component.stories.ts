import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "../../index";
import { expect, userEvent, within, waitFor } from "storybook/test";
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
export const Default: Story = {
  render: () => ({
    template:
      '<atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs>',
  }),
};
export const Keyboard: Story = {
  ...Default,
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
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-tabs-shape:1.5rem;--atr-comp-tabs-gap:1rem"><atr-tabs label="Profile sections"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs></section>',
  }),
};
export const ManualActivation: Story = {
  render: () => ({
    template:
      '<atr-tabs label="Profile sections" activation="manual"><div atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></div><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs>',
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
