import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
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
      ],
    }),
  ],
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
    template:
      '<atr-card [appearance]="appearance"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card>',
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
          '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5146bf"/><stop offset="1" stop-color="#9b8cff"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/></svg>',
        ),
    },
    template: `
      <atr-card [appearance]="appearance" style="max-inline-size: 22rem">
        <img atrCardMedia alt="Soft gradient cover" width="640" height="360" [src]="cover" style="aspect-ratio: 16 / 9; block-size: auto" />
        <header atrCardHeader><h2>Studio session</h2></header>
        <div atrCardContent>Elevated card with media slot, title and actions.</div>
        <footer atrCardActions>
          <button atrButton appearance="tonal" type="button">Share</button>
          <button atrButton type="button">Open</button>
        </footer>
      </atr-card>
    `,
  }),
};

export const Appearances: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));max-inline-size:48rem">
        <atr-card appearance="filled"><header atrCardHeader><h2>Filled</h2></header><div atrCardContent>Flat surface container.</div></atr-card>
        <atr-card appearance="elevated"><header atrCardHeader><h2>Elevated</h2></header><div atrCardContent>Raised with shadow.</div></atr-card>
        <atr-card appearance="outlined"><header atrCardHeader><h2>Outlined</h2></header><div atrCardContent>Border emphasis.</div></atr-card>
        <atr-card appearance="glass"><header atrCardHeader><h2>Glass</h2></header><div atrCardContent>Translucent surface.</div></atr-card>
      </div>
    `,
  }),
};
