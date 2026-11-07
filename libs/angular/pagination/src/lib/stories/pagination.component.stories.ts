import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumePagination } from "../../index";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Navigation/Pagination",
  component: AtralumePagination,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumePagination] })],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Pagination",
    pageCount: 50,
    page: 3,
    siblingCount: 1,
    loading: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    pageCount: { control: "number" },
    page: { control: "number" },
    siblingCount: { control: "number" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-pagination [label]="label" [pageCount]="pageCount" [(page)]="page" [siblingCount]="siblingCount" [loading]="loading" [disabled]="disabled" />',
  }),
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const host = canvasElement.querySelector("tui-pagination");
    await expect(host).toBeTruthy();
    const buttons = c.getAllByRole("button");
    await expect(buttons.length).toBeGreaterThan(2);
    // Click the right arrow (last button) to advance from page 3 → 4.
    await userEvent.click(buttons[buttons.length - 1]);
    await expect(canvasElement.querySelector("atr-pagination")).toBeTruthy();
  },
};
export const Links: Story = {
  render: () => ({
    template: '<atr-pagination [pageCount]="50" [page]="3" />',
  }),
};
