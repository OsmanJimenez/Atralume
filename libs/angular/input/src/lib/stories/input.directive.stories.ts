import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeInput } from "../../index";

export default {
  title: "Atoms/Input",
  decorators: [moduleMetadata({ imports: [AtralumeFormField, AtralumeInput] })],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Email",
    type: "email",
    value: "",
    autocomplete: "email",
    placeholder: "you@example.com",
    disabled: false,
    readonly: false,
    required: false,
    error: "",
    onInput: fn(),
  },
  argTypes: {
    label: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
    },
    value: { control: "text" },
    autocomplete: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    error: { control: "text" },
    onInput: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-form-field [label]="label" [required]="required" [error]="error || null"><input atrInput [type]="type" [value]="value" [autocomplete]="autocomplete" [placeholder]="placeholder" [disabled]="disabled" [readOnly]="readonly" [attr.aria-invalid]="error ? \'true\' : null" (input)="onInput($event)" /></atr-form-field>',
  }),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: args["label"],
    });
    await userEvent.type(input, "a");
    await expect(args["onInput"]).toHaveBeenCalled();
    await expect(input).toHaveValue(args["value"] + "a");
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<div style="display:grid;gap:1rem"><section data-atr-theme="light" data-atr-surface="standard"><atr-form-field label="Light"><input atrInput value="Light theme" /></atr-form-field></section><section data-atr-theme="dark" data-atr-surface="standard"><atr-form-field label="Dark"><input atrInput value="Dark theme" /></atr-form-field></section><section data-atr-theme="system" data-atr-surface="standard"><atr-form-field label="System"><input atrInput value="System theme" /></atr-form-field></section></div>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard"><atr-form-field label="Dark"><input atrInput value="Dark theme" /></atr-form-field><section data-atr-theme="light" data-atr-surface="standard"><atr-form-field label="Nested light"><input atrInput value="Light theme" /></atr-form-field></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:var(--atr-sys-color-primary-container)"><section data-atr-surface="glass" style="padding:1rem"><atr-form-field label="Email"><input atrInput value="alex@example.com" /></atr-form-field></section></div>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<atr-form-field label="Custom color"><input atrInput style="--atr-comp-form-field-text-color: #6750a4" value="alex@example.com" /></atr-form-field>',
  }),
};
