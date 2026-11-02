import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
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
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" style="padding:1rem"><atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-card-shape:1.5rem;--atr-comp-card-gap:1rem"><atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card></section>',
  }),
};
