import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { TuiAccordion } from "@taiga-ui/kit";
import { expect, userEvent, within } from "storybook/test";
export default {
  title: "Composition/Accordion",
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [TuiAccordion],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: { multi: false },
  argTypes: { multi: { control: "boolean" } },
  render: (args) => ({
    props: args,
    template: `
      <tui-accordion [closeOthers]="!multi" class="atr-accordion">
        <button tuiAccordion type="button">Profile</button>
        <tui-expand>
          <p>Profile details</p>
        </tui-expand>
        <button tuiAccordion type="button">Security</button>
        <tui-expand>
          <p>Security details</p>
        </tui-expand>
      </tui-accordion>
    `,
  }),
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const first = c.getByRole("button", { name: /Profile/ });
    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const second = c.getByRole("button", { name: /Security/ });
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  },
};
