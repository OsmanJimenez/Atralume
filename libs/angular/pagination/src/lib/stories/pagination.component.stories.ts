import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumePagination } from "../../index";
import { expect, userEvent, within, waitFor } from "storybook/test";
export default {
  title: "Navigation/Pagination",
  component: AtralumePagination,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumePagination] })],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template: '<atr-pagination [pageCount]="50" [page]="3" />',
  }),
};
export const Keyboard: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Next page" }));
    await expect(c.getByRole("button", { name: "Page 4" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const previous = c.getByRole("button", { name: "Previous page" });
    previous.focus();
    await userEvent.keyboard("{Enter}");
    await expect(c.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-pagination [pageCount]="50" [page]="3" /></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-pagination [pageCount]="50" [page]="3" /></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-pagination [pageCount]="50" [page]="3" /></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><atr-pagination [pageCount]="50" [page]="3" /></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-pagination-shape:1.5rem;--atr-comp-pagination-gap:1rem"><atr-pagination [pageCount]="50" [page]="3" /></section>',
  }),
};
export const Links: Story = {
  render: () => ({
    props: { url: (page: number) => "?page=" + page },
    template: '<atr-pagination [pageCount]="50" [page]="3" [href]="url" />',
  }),
};
export const Loading: Story = {
  render: () => ({
    template: '<atr-pagination [pageCount]="50" [page]="3" loading />',
  }),
};
