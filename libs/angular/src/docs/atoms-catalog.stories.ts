import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { AtralumeButton } from "@atralume/angular/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  closeIcon,
  arrowRightIcon,
} from "@atralume/angular/icon";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import { AtralumeLink } from "@atralume/angular/link";
import { AtralumeBadge } from "@atralume/angular/badge";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { AtralumeDivider } from "@atralume/angular/divider";
import {
  AtralumeProgressSpinner,
  AtralumeProgressBar,
} from "@atralume/angular/progress";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeFormField } from "@atralume/angular/form-field";
export default {
  title: "Atralume/Atoms",
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeButton,
        AtralumeIcon,
        AtralumeIconButton,
        AtralumeLink,
        AtralumeBadge,
        AtralumeAvatar,
        AtralumeDivider,
        AtralumeProgressSpinner,
        AtralumeProgressBar,
        AtralumeCheckbox,
        AtralumeInput,
        AtralumeRadio,
        AtralumeSwitch,
        AtralumeTextarea,
        AtralumeFormField,
      ],
      providers: [provideAtralumeIcons([checkIcon, closeIcon, arrowRightIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:radial-gradient(circle at 15% 25%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-sys-shape-large);max-width:48rem;margin:auto"><p style="margin:0;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Atralume / Atoms</p><h2 style="margin:.5rem 0 1.5rem">Small pieces. A shared language.</h2><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><atr-avatar name="Alex Morgan" alt="" /><div><strong>Alex Morgan</strong><div style="margin-top:.35rem"><atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge> <atr-badge appearance="outlined" tone="primary">Team member</atr-badge></div></div></div><hr atrDivider /><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><button atrButton type="button"><atr-icon name="check" />Save changes</button><button atrIconButton type="button" appearance="outlined" aria-label="Close preview"><atr-icon name="close" /></button><a atrLink appearance="standalone" href="#documentation">Documentation<atr-icon name="arrow-right" /></a></div><div style="margin-top:2rem"><div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem"><atr-progress-spinner size="small" label="Saving profile" /><span>Saving your profile\u2026</span></div><atr-progress-bar label="Profile completion" [value]="65" /></div><p style="margin:1.5rem 0 0;font-size:.875rem">One token contract across themes, surfaces and local overrides.</p></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:radial-gradient(circle at 15% 25%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem;border-radius:var(--atr-sys-shape-large);max-width:48rem;margin:auto"><p style="margin:0;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Atralume / Atoms</p><h2 style="margin:.5rem 0 1.5rem">Small pieces. A shared language.</h2><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><atr-avatar name="Alex Morgan" alt="" /><div><strong>Alex Morgan</strong><div style="margin-top:.35rem"><atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge> <atr-badge appearance="outlined" tone="primary">Team member</atr-badge></div></div></div><hr atrDivider /><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><button atrButton type="button"><atr-icon name="check" />Save changes</button><button atrIconButton type="button" appearance="outlined" aria-label="Close preview"><atr-icon name="close" /></button><a atrLink appearance="standalone" href="#documentation">Documentation<atr-icon name="arrow-right" /></a></div><div style="margin-top:2rem"><div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem"><atr-progress-spinner size="small" label="Saving profile" /><span>Saving your profile\u2026</span></div><atr-progress-bar label="Profile completion" [value]="65" /></div><p style="margin:1.5rem 0 0;font-size:.875rem">One token contract across themes, surfaces and local overrides.</p></section></div>',
  }),
};
export const Glass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:radial-gradient(circle at 15% 25%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem;border-radius:var(--atr-sys-shape-large);max-width:48rem;margin:auto"><p style="margin:0;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Atralume / Atoms</p><h2 style="margin:.5rem 0 1.5rem">Small pieces. A shared language.</h2><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><atr-avatar name="Alex Morgan" alt="" /><div><strong>Alex Morgan</strong><div style="margin-top:.35rem"><atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge> <atr-badge appearance="outlined" tone="primary">Team member</atr-badge></div></div></div><hr atrDivider /><div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap"><button atrButton type="button"><atr-icon name="check" />Save changes</button><button atrIconButton type="button" appearance="outlined" aria-label="Close preview"><atr-icon name="close" /></button><a atrLink appearance="standalone" href="#documentation">Documentation<atr-icon name="arrow-right" /></a></div><div style="margin-top:2rem"><div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem"><atr-progress-spinner size="small" label="Saving profile" /><span>Saving your profile\u2026</span></div><atr-progress-bar label="Profile completion" [value]="65" /></div><p style="margin:1.5rem 0 0;font-size:.875rem">One token contract across themes, surfaces and local overrides.</p></section></div>',
  }),
};
export const FormControls: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:1rem;padding:2rem">
        <section data-atr-theme="light" data-atr-surface="standard" style="display:grid;gap:1rem;padding:1.5rem">
          <h2>Light</h2>
          <atr-form-field label="Email"><input atrInput type="email" value="alex@example.com" /></atr-form-field>
          <atr-form-field label="Message"><textarea atrTextarea rows="2">Hello, Atralume.</textarea></atr-form-field>
          <label><input atrCheckbox type="checkbox" checked /> Accept terms</label>
          <fieldset>
            <legend>Plan</legend>
            <label><input atrRadio type="radio" name="light-plan" value="personal" checked /> Personal</label>
            <label><input atrRadio type="radio" name="light-plan" value="business" /> Business</label>
          </fieldset>
          <label><input atrSwitch type="checkbox" checked /> Enable notifications</label>
        </section>
        <section data-atr-theme="dark" data-atr-surface="standard" style="display:grid;gap:1rem;padding:1.5rem">
          <h2>Dark</h2>
          <atr-form-field label="Email"><input atrInput type="email" value="alex@example.com" /></atr-form-field>
          <atr-form-field label="Message"><textarea atrTextarea rows="2">Hello, Atralume.</textarea></atr-form-field>
          <label><input atrCheckbox type="checkbox" checked /> Accept terms</label>
          <fieldset>
            <legend>Plan</legend>
            <label><input atrRadio type="radio" name="dark-plan" value="personal" checked /> Personal</label>
            <label><input atrRadio type="radio" name="dark-plan" value="business" /> Business</label>
          </fieldset>
          <label><input atrSwitch type="checkbox" checked /> Enable notifications</label>
        </section>
        <section data-atr-theme="light" data-atr-surface="glass" style="display:grid;gap:1rem;padding:1.5rem">
          <h2>Glass</h2>
          <atr-form-field label="Email"><input atrInput type="email" value="alex@example.com" /></atr-form-field>
          <atr-form-field label="Message"><textarea atrTextarea rows="2">Hello, Atralume.</textarea></atr-form-field>
          <label><input atrCheckbox type="checkbox" checked /> Accept terms</label>
          <fieldset>
            <legend>Plan</legend>
            <label><input atrRadio type="radio" name="glass-plan" value="personal" checked /> Personal</label>
            <label><input atrRadio type="radio" name="glass-plan" value="business" /> Business</label>
          </fieldset>
          <label><input atrSwitch type="checkbox" checked /> Enable notifications</label>
        </section>
      </div>
    `,
  }),
};
