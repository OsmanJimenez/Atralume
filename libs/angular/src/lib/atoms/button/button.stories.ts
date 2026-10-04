import type { Meta, StoryObj } from "@storybook/angular";
import { AtralumeButton } from "@atralume/angular/button";

const meta: Meta<AtralumeButton> = {
  title: "Atoms/Button",
  component: AtralumeButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A native semantic button enhanced by Atralume. Import `AtralumeButton` from `@atralume/angular/button`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<AtralumeButton>;

export const Default: Story = {
  render: () => ({
    template: '<button atrButton type="button">Continue</button>',
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: '<button atrButton type="button" disabled>Unavailable</button>',
  }),
};

export const Themes: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(12rem,1fr));gap:1rem">
        <section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-radius-medium)">
          <button atrButton type="button">Light theme</button>
        </section>
        <section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-radius-medium)">
          <button atrButton type="button">Dark theme</button>
        </section>
      </div>`,
  }),
};
