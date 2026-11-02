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
export const Default: Story = {
  render: () => ({
    template:
      '<atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial>',
  }),
};
export const Keyboard: Story = {
  ...Default,
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
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-speed-dial-shape:1.5rem;--atr-comp-speed-dial-gap:1rem"><atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial></section>',
  }),
};
