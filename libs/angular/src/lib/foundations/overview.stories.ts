import type { Meta, StoryObj } from "@storybook/angular";

const meta: Meta = {
  title: "Foundations/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Load `@atralume/angular/styles/theme.css`, then select light or dark with `data-atr-theme`. Surface treatment is independent through `data-atr-surface`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Tokens: Story = {
  render: () => ({
    template: `
      <div data-atr-surface="standard" style="padding:2rem;border:1px solid var(--atr-color-border);border-radius:var(--atr-radius-medium);font-family:var(--atr-font-family)">
        <h2 style="margin-top:0">Atralume foundations</h2>
        <p>Theme and surface tokens are CSS custom properties and may be overridden by consumers.</p>
        <div style="display:flex;gap:1rem">
          <span style="width:4rem;height:4rem;border-radius:var(--atr-radius-medium);background:var(--atr-color-primary)"></span>
          <span style="width:4rem;height:4rem;border-radius:var(--atr-radius-medium);background:var(--atr-color-surface);border:1px solid var(--atr-color-border)"></span>
        </div>
      </div>`,
  }),
};
