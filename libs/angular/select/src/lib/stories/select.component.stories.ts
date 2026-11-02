import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, waitFor, within } from "storybook/test";
import { SelectionDemo } from "../../../../src/docs/phase4/selection-demo.component";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
const meta = {
  title: "Advanced Forms/Select",
  component: SelectionDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [SelectionDemo] })],
  args: {
    family: "select",
    disabled: false,
    loading: false,
    empty: false,
    error: false,
    multiple: false,
    large: false,
  },
} satisfies Meta<SelectionDemo>;
export default meta;
type Story = StoryObj<SelectionDemo>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { empty: true } };
export const Error: Story = { args: { error: true } };
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const document = canvasElement.ownerDocument;
    const control = canvas.getByRole("combobox");
    control.focus();
    await pressKey(document, "ArrowDown");
    await waitFor(() =>
      expect(
        within(document.body).getAllByRole("option").length,
      ).toBeGreaterThan(0),
    );
    await pressKey(document, "Enter");
    await expect(await canvas.findByText('Value: "a"')).toBeVisible();
  },
};
export const Multiple: Story = { args: { multiple: true } };
export const Forms: Story = { ...Keyboard };
export const LargeDataset: Story = { args: { large: true } };
export const Light: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" ><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const Dark: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="dark" data-atr-surface="standard" ><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const Glass: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="glass" ><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const RTL: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl"><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const ConsumerOverride: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" style="--atr-comp-listbox-selected-container-color:var(--atr-sys-color-tertiary-container)"><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const Responsive: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" style="max-inline-size:20rem"><atr-selection-demo [family]="family" [disabled]="disabled" [loading]="loading" [empty]="empty" [error]="error" [multiple]="multiple" [large]="large" /></section></div>`,
  }),
};
export const NestedTheme: Story = {
  render: (args) => ({
    props: args,
    template: `<section data-atr-theme="dark"><section data-atr-theme="light"><atr-selection-demo [family]="family" /></section></section>`,
  }),
};
