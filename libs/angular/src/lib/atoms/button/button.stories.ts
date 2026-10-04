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

export const System: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><button atrButton type="button">System theme</button></section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><button atrButton type="button">Light</button><section data-atr-theme="dark" data-atr-surface="standard" style="margin-top:1rem;padding:2rem"><button atrButton type="button">Nested dark</button></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:4rem;background:radial-gradient(circle,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-surface="glass" style="padding:2rem;border-radius:var(--atr-sys-shape-large)"><button atrButton type="button">Glass action</button></section></div>',
  }),
};

export const FocusVisible: Story = {
  play: async ({ canvasElement }) => {
    (canvasElement.querySelector("button") as HTMLButtonElement).focus();
  },
  render: () => ({
    template: '<button atrButton type="button">Keyboard focus</button>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<button atrButton type="button" style="--atr-comp-button-container-color:var(--atr-sys-color-tertiary);--atr-comp-button-label-color:var(--atr-sys-color-on-tertiary)">Overridden</button>',
  }),
};
