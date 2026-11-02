import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeRadio } from "../../index";

export default {
  title: "Atoms/Radio",
  decorators: [
    moduleMetadata({ imports: [AtralumeRadio, AtralumeControlLabel] }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    selectedPlan: "personal",
    disabled: false,
    invalid: false,
    onChange: fn(),
  },
  argTypes: {
    selectedPlan: {
      control: "select",
      options: ["personal", "business"],
    },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    onChange: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<fieldset [attr.aria-invalid]="invalid ? \'true\' : null"><legend>Plan</legend><label atrControlLabel><input atrRadio type="radio" name="playground-plan" value="personal" [checked]="selectedPlan === \'personal\'" [disabled]="disabled" (change)="onChange($event)" /><span>Personal</span></label><label atrControlLabel><input atrRadio type="radio" name="playground-plan" value="business" [checked]="selectedPlan === \'business\'" [disabled]="disabled" (change)="onChange($event)" /><span>Business</span></label></fieldset>',
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const business = canvas.getByRole("radio", { name: "Business" });
    await userEvent.click(business);
    await expect(business).toBeChecked();
    await expect(args["onChange"]).toHaveBeenCalled();
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<div style="display:grid;gap:1rem"><section data-atr-theme="light" data-atr-surface="standard"><fieldset><legend>Light plan</legend><label atrControlLabel><input atrRadio type="radio" name="light-plan" checked /><span>Personal</span></label></fieldset></section><section data-atr-theme="dark" data-atr-surface="standard"><fieldset><legend>Dark plan</legend><label atrControlLabel><input atrRadio type="radio" name="dark-plan" checked /><span>Personal</span></label></fieldset></section><section data-atr-theme="system" data-atr-surface="standard"><fieldset><legend>System plan</legend><label atrControlLabel><input atrRadio type="radio" name="system-plan" checked /><span>Personal</span></label></fieldset></section></div>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard"><fieldset><legend>Dark plan</legend><label atrControlLabel><input atrRadio type="radio" name="dark-nested-plan" checked /><span>Personal</span></label></fieldset><section data-atr-theme="light" data-atr-surface="standard"><fieldset><legend>Nested light plan</legend><label atrControlLabel><input atrRadio type="radio" name="light-nested-plan" checked /><span>Personal</span></label></fieldset></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:var(--atr-sys-color-primary-container)"><section data-atr-surface="glass" style="padding:1rem"><fieldset><legend>Plan</legend><label atrControlLabel><input atrRadio type="radio" name="glass-plan" checked /><span>Personal</span></label></fieldset></section></div>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<label atrControlLabel style="--atr-comp-form-field-selected-color: #6750a4"><input atrRadio type="radio" name="custom-plan" checked /><span>Personal</span></label>',
  }),
};

export const Interaction: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const personal = canvas.getByRole("radio", { name: "Personal" });
    const business = canvas.getByRole("radio", { name: "Business" });
    personal.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(business).toBeChecked();
    await expect(personal).not.toBeChecked();
  },
};
