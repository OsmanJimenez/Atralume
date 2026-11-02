import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeTextarea } from "../../index";

export default {
  title: "Atoms/Textarea",
  decorators: [
    moduleMetadata({ imports: [AtralumeFormField, AtralumeTextarea] }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    label: "Message",
    value: "",
    placeholder: "Write a message",
    rows: 3,
    maxlength: null,
    resize: "vertical",
    disabled: false,
    readonly: false,
    error: "",
    onInput: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 10, step: 1 } },
    maxlength: { control: { type: "number", min: 1, max: 1000, step: 1 } },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    error: { control: "text" },
    onInput: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-form-field [label]="label" [error]="error || null"><textarea atrTextarea [value]="value" [placeholder]="placeholder" [rows]="rows" [maxlength]="maxlength" [resize]="resize" [disabled]="disabled" [readOnly]="readonly" [attr.aria-invalid]="error ? \'true\' : null" (input)="onInput($event)"></textarea></atr-form-field>',
  }),
  play: async ({ args, canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox", {
      name: args["label"],
    });
    await userEvent.type(textarea, "a");
    await expect(args["onInput"]).toHaveBeenCalled();
    await expect(textarea).toHaveValue(args["value"] + "a");
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<div style="display:grid;gap:1rem"><section data-atr-theme="light" data-atr-surface="standard"><atr-form-field label="Light"><textarea atrTextarea rows="2">Light theme</textarea></atr-form-field></section><section data-atr-theme="dark" data-atr-surface="standard"><atr-form-field label="Dark"><textarea atrTextarea rows="2">Dark theme</textarea></atr-form-field></section><section data-atr-theme="system" data-atr-surface="standard"><atr-form-field label="System"><textarea atrTextarea rows="2">System theme</textarea></atr-form-field></section></div>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard"><atr-form-field label="Dark"><textarea atrTextarea rows="2">Dark theme</textarea></atr-form-field><section data-atr-theme="light" data-atr-surface="standard"><atr-form-field label="Nested light"><textarea atrTextarea rows="2">Light theme</textarea></atr-form-field></section></section>',
  }),
};

export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:var(--atr-sys-color-primary-container)"><section data-atr-surface="glass" style="padding:1rem"><atr-form-field label="Message"><textarea atrTextarea rows="2">Hello, Atralume.</textarea></atr-form-field></section></div>',
  }),
};

export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<atr-form-field label="Custom color"><textarea atrTextarea rows="2" style="--atr-comp-form-field-text-color: #6750a4">Custom token override</textarea></atr-form-field>',
  }),
};
