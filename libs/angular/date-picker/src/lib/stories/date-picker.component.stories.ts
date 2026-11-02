import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AdvancedInputDemo } from "../../../../src/docs/phase4/input-demo.component";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
const meta = {
  title: "Advanced Forms/Date Picker",
  component: AdvancedInputDemo,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AdvancedInputDemo] })],
  args: {
    family: "date-picker",
    disabled: false,
    readOnly: false,
    range: false,
    vertical: false,
    twelveHour: false,
    seconds: false,
    error: false,
    uploading: false,
    dialog: false,
    previews: false,
  },
} satisfies Meta<AdvancedInputDemo>;
export default meta;
type Story = StoryObj<AdvancedInputDemo>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: true } };
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const document = canvasElement.ownerDocument;
    await userEvent.click(
      canvas.getByRole("button", { name: "Open Appointment calendar" }),
    );
    await userEvent.click(
      within(document.body).getByRole("button", {
        name: "Thursday, November 5, 2026",
      }),
    );
    await expect(await canvas.findByText("Value: 2026-11-05")).toBeVisible();
  },
};
export const Forms: Story = { ...Keyboard };
export const Range: Story = { args: { range: true } };
export const Dialog: Story = { args: { dialog: true }, play: Keyboard.play };
export const Readonly: Story = { args: { readOnly: true } };
export const Light: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" ><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const Dark: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="dark" data-atr-surface="standard" ><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const Glass: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="glass" ><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const RTL: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl"><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const ConsumerOverride: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" style="--atr-comp-slider-thumb-color:var(--atr-sys-color-tertiary);--atr-comp-calendar-shape:1.5rem"><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const Responsive: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="padding:1rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section data-atr-theme="light" data-atr-surface="standard" style="max-inline-size:20rem"><atr-advanced-input-demo [family]="family" [disabled]="disabled" [readOnly]="readOnly" [range]="range" [vertical]="vertical" [twelveHour]="twelveHour" [seconds]="seconds" [error]="error" [uploading]="uploading" [dialog]="dialog" [previews]="previews" /></section></div>`,
  }),
};
export const NestedTheme: Story = {
  render: (args) => ({
    props: args,
    template: `<section data-atr-theme="dark"><section data-atr-theme="light"><atr-advanced-input-demo [family]="family" /></section></section>`,
  }),
};
