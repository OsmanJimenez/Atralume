import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "../../index";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
import { AtralumeBadge } from "@osmanjimenez/atralume/badge";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
  AtralumeListTrailing,
} from "@osmanjimenez/atralume/list";
import { expect, userEvent, within } from "storybook/test";

const playgroundTemplate = `
  <atr-tabs
    class="atr-tabs-playground"
    [label]="label"
    [activation]="activation"
    [orientation]="orientation"
  >
    <tui-tabs atrTabList>
      <button atrTab id="overview-tab" panel="overview-panel" type="button">
        Overview
      </button>
      <button atrTab id="activity-tab" panel="activity-panel" type="button">
        Activity
      </button>
      <button atrTab id="billing-tab" panel="billing-panel" type="button">
        Billing
      </button>
      <button
        atrTab
        id="disabled-tab"
        panel="disabled-panel"
        type="button"
        disabled
      >
        Unavailable
      </button>
    </tui-tabs>

    <section atrTabPanel id="overview-panel" labelledBy="overview-tab">
      <header class="atr-tabs-playground__header">
        <atr-avatar name="Alex Morgan" alt="Alex Morgan" size="large" />
        <div class="atr-tabs-playground__intro">
          <div class="atr-tabs-playground__title-row">
            <h3 class="atr-tabs-playground__title">Alex Morgan</h3>
            <atr-badge tone="success" appearance="soft">Verified host</atr-badge>
          </div>
          <p class="atr-tabs-playground__lede">
            Storefront profile for guest bookings. Keep contact details current so
            confirmations and invoices stay accurate.
          </p>
        </div>
      </header>
      <ul atrList density="comfortable">
        <li atrListItem>
          <span>
            <span atrListHeadline>Display name</span>
            <span atrListSupporting>Shown on booking receipts</span>
          </span>
          <span atrListTrailing>Alex Morgan</span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>Primary email</span>
            <span atrListSupporting>Account recovery and invoices</span>
          </span>
          <span atrListTrailing>alex@atelier.example</span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>Timezone</span>
            <span atrListSupporting>Used for check-in windows</span>
          </span>
          <span atrListTrailing>Europe/Madrid</span>
        </li>
      </ul>
      <div class="atr-tabs-playground__actions">
        <button atrButton type="button" appearance="outlined">Edit profile</button>
        <button atrButton type="button">Share public page</button>
      </div>
    </section>

    <section atrTabPanel id="activity-panel" labelledBy="activity-tab">
      <header class="atr-tabs-playground__section-head">
        <h3 class="atr-tabs-playground__title">Recent activity</h3>
        <p class="atr-tabs-playground__lede">
          Latest account changes across bookings and billing.
        </p>
      </header>
      <ul atrList density="comfortable">
        <li atrListItem>
          <span>
            <span atrListHeadline>Payout schedule updated</span>
            <span atrListSupporting>Weekly transfers · yesterday</span>
          </span>
          <span atrListTrailing>
            <atr-badge tone="info" appearance="soft">Billing</atr-badge>
          </span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>New booking confirmed</span>
            <span atrListSupporting>Suite 12 · 3 nights · 2 days ago</span>
          </span>
          <span atrListTrailing>
            <atr-badge tone="success" appearance="soft">Booking</atr-badge>
          </span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>Profile photo refreshed</span>
            <span atrListSupporting>Visible on the public listing · last week</span>
          </span>
          <span atrListTrailing>
            <atr-badge tone="neutral" appearance="soft">Profile</atr-badge>
          </span>
        </li>
      </ul>
    </section>

    <section atrTabPanel id="billing-panel" labelledBy="billing-tab">
      <header class="atr-tabs-playground__section-head">
        <h3 class="atr-tabs-playground__title">Billing &amp; plan</h3>
        <p class="atr-tabs-playground__lede">
          Manage the subscription that powers your storefront and guest checkout.
        </p>
      </header>
      <ul atrList density="comfortable">
        <li atrListItem>
          <span>
            <span atrListHeadline>Current plan</span>
            <span atrListSupporting>Renews on the 12th of each month</span>
          </span>
          <span atrListTrailing>Studio Pro</span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>Payment method</span>
            <span atrListSupporting>Charges appear as Atralume Commerce</span>
          </span>
          <span atrListTrailing>Visa ···· 4242</span>
        </li>
        <li atrListItem>
          <span>
            <span atrListHeadline>Next invoice</span>
            <span atrListSupporting>Estimated before tax</span>
          </span>
          <span atrListTrailing>EUR 49.00</span>
        </li>
      </ul>
      <div class="atr-tabs-playground__actions">
        <button atrButton type="button" appearance="outlined">
          Update payment
        </button>
        <button atrButton type="button" appearance="text">View invoices</button>
      </div>
    </section>

    <section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">
      <header class="atr-tabs-playground__section-head">
        <h3 class="atr-tabs-playground__title">Section unavailable</h3>
        <p class="atr-tabs-playground__lede">
          This workspace has not enabled team permissions yet. Ask an owner to
          unlock it from organization settings.
        </p>
      </header>
    </section>
  </atr-tabs>
`;

export default {
  title: "Navigation/Tabs",
  component: AtralumeTabs,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeTabs,
        AtralumeTabList,
        AtralumeTab,
        AtralumeTabPanel,
        AtralumeAvatar,
        AtralumeBadge,
        AtralumeButton,
        AtralumeList,
        AtralumeListItem,
        AtralumeListHeadline,
        AtralumeListSupporting,
        AtralumeListTrailing,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Profile sections",
    activation: "automatic",
    orientation: "horizontal",
  },
  argTypes: {
    label: { control: "text" },
    activation: { control: "select", options: ["automatic", "manual"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  render: (args) => ({
    props: args,
    styles: [
      `
      .atr-tabs-playground {
        max-inline-size: 44rem;
      }
      .atr-tabs-playground__header {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--atr-sys-spacing-md);
      }
      .atr-tabs-playground__intro,
      .atr-tabs-playground__section-head {
        display: flex;
        flex: 1 1 16rem;
        flex-direction: column;
        gap: var(--atr-sys-spacing-xs);
        min-inline-size: 0;
      }
      .atr-tabs-playground__title-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--atr-sys-spacing-sm);
      }
      .atr-tabs-playground__title {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.35;
      }
      .atr-tabs-playground__lede {
        margin: 0;
        color: var(--atr-sys-color-on-surface-variant);
        font-size: 0.9375rem;
        line-height: 1.5;
      }
      .atr-tabs-playground__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--atr-sys-spacing-sm);
      }
      `,
    ],
    template: playgroundTemplate,
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
    await expect(c.getByRole("tab", { name: "Billing" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(first).toHaveFocus();
  },
};

export const ManualActivation: Story = {
  ...Playground,
  args: {
    ...Playground.args,
    activation: "manual",
  },
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
