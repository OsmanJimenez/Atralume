import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
import { AtralumeGrid } from "@osmanjimenez/atralume/grid";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
  AtralumeCardMedia,
} from "../../index";

export default {
  title: "Composition/Card",
  component: AtralumeCard,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeButton,
        AtralumeAvatar,
        AtralumeCard,
        AtralumeCardHeader,
        AtralumeCardContent,
        AtralumeCardActions,
        AtralumeCardMedia,
        AtralumeGrid,
      ],
    }),
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: { appearance: "elevated" },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "elevated", "outlined", "glass"],
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <atr-card [appearance]="appearance" style="max-inline-size: 24rem">
        <header atrCardHeader>
          <atr-avatar name="Alex Morgan" alt="Alex Morgan" />
          <div>
            <h2>Alex Morgan</h2>
            <p style="margin: 0.15rem 0 0; color: var(--atr-sys-color-on-surface-variant); font-size: var(--atr-sys-typography-body-small-font-size)">
              Product design · Workspace owner
            </p>
          </div>
        </header>
        <div atrCardContent>
          <p>
            Keep your profile current so teammates can find the right
            channels, time zone, and project ownership at a glance.
          </p>
          <p>
            Last signed in from San José · Two-factor authentication is on.
          </p>
        </div>
        <footer atrCardActions>
          <button atrButton appearance="tonal" type="button">
            Edit profile
          </button>
          <button atrButton type="button">Manage account</button>
        </footer>
      </atr-card>
    `,
  }),
};

export const WithMedia: Story = {
  args: { appearance: "elevated" },
  argTypes: Playground.argTypes,
  render: (args) => ({
    props: {
      ...args,
      cover:
        "data:image/svg+xml," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5146bf"/><stop offset="1" stop-color="#9b8cff"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="36" y="300" fill="white" font-family="system-ui,sans-serif" font-size="28" font-weight="600">North studio</text><text x="36" y="336" fill="#e8e4ff" font-family="system-ui,sans-serif" font-size="16">Session cover</text></svg>',
        ),
    },
    template: `
      <atr-card [appearance]="appearance" style="max-inline-size: 24rem">
        <img
          atrCardMedia
          alt="Soft gradient cover for North studio"
          width="640"
          height="360"
          [src]="cover"
          style="aspect-ratio: 16 / 9; block-size: auto"
        />
        <header atrCardHeader>
          <div>
            <h2>Studio session</h2>
            <p style="margin: 0.15rem 0 0; color: var(--atr-sys-color-on-surface-variant); font-size: var(--atr-sys-typography-body-small-font-size)">
              Thursday · 10:00–11:30
            </p>
          </div>
        </header>
        <div atrCardContent>
          Review brand tokens, card elevation, and the account surface before
          the weekly handoff. Media sits flush to the card edges.
        </div>
        <footer atrCardActions>
          <button atrButton appearance="tonal" type="button">Share</button>
          <button atrButton type="button">Open session</button>
        </footer>
      </atr-card>
    `,
  }),
};

export const Appearances: Story = {
  render: () => ({
    template: `
      <div
        style="
          padding: 1.5rem;
          border-radius: 1rem;
          max-inline-size: 52rem;
          background:
            radial-gradient(120% 80% at 10% 15%, color-mix(in srgb, var(--atr-sys-color-primary) 32%, transparent), transparent 55%),
            radial-gradient(90% 70% at 95% 85%, color-mix(in srgb, var(--atr-sys-color-tertiary) 36%, transparent), transparent 50%),
            linear-gradient(135deg, var(--atr-sys-color-primary-container), var(--atr-sys-color-surface-container-high), var(--atr-sys-color-tertiary-container));
        "
      >
        <atr-grid columns="auto" gap="md" minTrack="15rem">
          <atr-card appearance="filled">
            <header atrCardHeader><h2>Filled</h2></header>
            <div atrCardContent>
              Flat surface container for dense layouts and nested panels.
            </div>
            <footer atrCardActions>
              <button atrButton appearance="text" type="button">Details</button>
            </footer>
          </atr-card>
          <atr-card appearance="elevated">
            <header atrCardHeader><h2>Elevated</h2></header>
            <div atrCardContent>
              Raised surface with a soft shadow and a light hover lift.
            </div>
            <footer atrCardActions>
              <button atrButton appearance="text" type="button">Details</button>
            </footer>
          </atr-card>
          <atr-card appearance="outlined">
            <header atrCardHeader><h2>Outlined</h2></header>
            <div atrCardContent>
              Border emphasis when elevation would compete with nearby chrome.
            </div>
            <footer atrCardActions>
              <button atrButton appearance="text" type="button">Details</button>
            </footer>
          </atr-card>
          <atr-card appearance="glass">
            <header atrCardHeader><h2>Glass</h2></header>
            <div atrCardContent>
              Translucent surface that lets brand depth show through.
            </div>
            <footer atrCardActions>
              <button atrButton appearance="text" type="button">Details</button>
            </footer>
          </atr-card>
        </atr-grid>
      </div>
    `,
  }),
};
