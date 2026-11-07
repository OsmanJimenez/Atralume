import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeSpeedDial, AtralumeSpeedDialAction } from "../../index";
import { expect, userEvent, within, waitFor } from "storybook/test";
export default {
  title: "Actions/Speed Dial",
  component: AtralumeSpeedDial,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({ imports: [AtralumeSpeedDial, AtralumeSpeedDialAction] }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Create",
    opened: false,
    disabled: false,
    orientation: "vertical",
  },
  argTypes: {
    label: { control: "text" },
    opened: { control: "boolean" },
    disabled: { control: "boolean" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-speed-dial id="create-dial" [label]="label" [(opened)]="opened" [disabled]="disabled" [orientation]="orientation"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial>',
  }),
};
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Create" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(c.getByRole("button", { name: "Document" })).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(c.getByRole("button", { name: "Project" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};
