import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
import { AtralumeCheckbox } from "../../index";

export default {
  title: "Atoms/Checkbox",
  decorators: [
    moduleMetadata({ imports: [AtralumeCheckbox, AtralumeControlLabel] }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Accept terms",
    checked: false,
    indeterminate: false,
    disabled: false,
    invalid: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    onChange: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<label atrControlLabel><input atrCheckbox type="checkbox" [checked]="checked" [indeterminate]="indeterminate" [disabled]="disabled" [attr.aria-invalid]="invalid ? \'true\' : null" (change)="onChange($event)" /><span>{{label}}</span></label>',
  }),
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: args["label"],
    });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args["onChange"]).toHaveBeenCalled();
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<div style="display:grid;gap:1rem"><section data-atr-theme="light" data-atr-surface="standard"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>Light</span></label></section><section data-atr-theme="dark" data-atr-surface="standard"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>Dark</span></label></section><section data-atr-theme="system" data-atr-surface="standard"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>System</span></label></section></div>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>Dark</span></label><section data-atr-theme="light" data-atr-surface="standard"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>Nested light</span></label></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:var(--atr-sys-color-primary-container)"><section data-atr-surface="glass" style="padding:1rem"><label atrControlLabel><input atrCheckbox type="checkbox" checked /><span>Accept terms</span></label></section></div>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<label atrControlLabel style="--atr-comp-form-field-selected-color: #6750a4"><input atrCheckbox type="checkbox" checked /><span>Custom selected color</span></label>',
  }),
};

export const Interaction: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: "Accept terms" });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    checkbox.focus();
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
  },
};
