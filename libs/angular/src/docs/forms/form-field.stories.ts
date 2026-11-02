import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeFormField,
  AtralumeControlLabel,
} from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeSwitch } from "@atralume/angular/switch";
import { FormsDemo } from "./forms-demo.component";
import { SignalDemo } from "./signal-demo.component";
import { TemplateDemo } from "./template-demo.component";

export default {
  title: "Forms/Form Field",
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeFormField,
        AtralumeControlLabel,
        AtralumeInput,
        AtralumeTextarea,
        AtralumeCheckbox,
        AtralumeRadio,
        AtralumeSwitch,
        FormsDemo,
        SignalDemo,
        TemplateDemo,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" ><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const FilledAppearance: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" appearance="filled"><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const OutlineAppearance: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" appearance="outline"><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const WithHint: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" hint="Use your work email."><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const Required: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" required><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const Optional: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" optional><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const Invalid: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" error="Enter a valid value."><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const Disabled: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" ><input atrInput type="email" disabled /></atr-form-field></section>',
  }),
};
export const Readonly: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" ><input atrInput type="email" readonly /></atr-form-field></section>',
  }),
};
export const Compact: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  ><atr-form-field label="Email" density="compact"><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const DarkTheme: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo" data-atr-theme="dark"  data-atr-surface="standard"><atr-form-field label="Email" ><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const GlassSurface: Story = {
  render: () => ({
    template:
      '<section class="atr-forms-demo"  data-atr-surface="glass"><atr-form-field label="Email" ><input atrInput type="email"  /></atr-form-field></section>',
  }),
};
export const ReactiveForms: Story = {
  render: () => ({ template: "<atr-forms-demo />" }),
};
export const TemplateDrivenForms: Story = {
  render: () => ({ template: "<atr-template-demo />" }),
};
export const SignalForms: Story = {
  render: () => ({ template: "<atr-signal-demo />" }),
};
