import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeSwitch } from "../../index";

export default {
  title: "Atoms/Switch",
  decorators: [
    moduleMetadata({ imports: [AtralumeSwitch, AtralumeControlLabel] }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Enable notifications",
    checked: false,
    disabled: false,
    invalid: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    onChange: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<label atrControlLabel><input atrSwitch type="checkbox" [checked]="checked" [disabled]="disabled" [attr.aria-invalid]="invalid ? \'true\' : null" (change)="onChange($event)" /><span>{{label}}</span></label>',
  }),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole("switch", {
      name: args["label"],
    });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args["onChange"]).toHaveBeenCalled();
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<div style="display:grid;gap:1rem"><section data-atr-theme="light" data-atr-surface="standard"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>Light notifications</span></label></section><section data-atr-theme="dark" data-atr-surface="standard"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>Dark notifications</span></label></section><section data-atr-theme="system" data-atr-surface="standard"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>System notifications</span></label></section></div>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>Dark notifications</span></label><section data-atr-theme="light" data-atr-surface="standard"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>Nested light notifications</span></label></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:var(--atr-sys-color-primary-container)"><section data-atr-surface="glass" style="padding:1rem"><label atrControlLabel><input atrSwitch type="checkbox" checked /><span>Enable notifications</span></label></section></div>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<label atrControlLabel style="--atr-comp-form-field-selected-color: #6750a4"><input atrSwitch type="checkbox" checked /><span>Custom selected color</span></label>',
  }),
};

export const Interaction: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", {
      name: "Enable notifications",
    });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    toggle.focus();
    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();
  },
};
