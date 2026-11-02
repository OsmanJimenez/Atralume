import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeAccordion,
  AtralumeAccordionItem,
  AtralumeAccordionHeader,
  AtralumeAccordionPanel,
} from "../../index";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Composition/Accordion",
  component: AtralumeAccordion,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeAccordion,
        AtralumeAccordionItem,
        AtralumeAccordionHeader,
        AtralumeAccordionPanel,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion>',
  }),
};
export const Keyboard: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const first = c.getByRole("button", { name: /Profile/ });
    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowDown}");
    const second = c.getByRole("button", { name: /Security/ });
    await expect(second).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(second).toHaveAttribute("aria-expanded", "true");
  },
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" style="padding:1rem"><atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-accordion-shape:1.5rem;--atr-comp-accordion-gap:1rem"><atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion></section>',
  }),
};
