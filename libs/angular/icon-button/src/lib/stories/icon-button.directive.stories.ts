import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AtralumeIcon,
  closeIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeIconButton } from "../../index";
export default {
  component: AtralumeIconButton,
  title: "Atoms/Icon Button",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeIconButton],
      providers: [provideAtralumeIcons([closeIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    appearance: "standard",
    size: "medium",
    disabled: false,
    onAction: fn(),
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    onAction: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<button atrIconButton type="button" aria-label="Close" [appearance]="appearance" [size]="size" [disabled]="disabled" (click)="onAction($event)"><atr-icon name="close" /></button>',
  }),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Close" }),
    );
    await expect(args["onAction"]).toHaveBeenCalledOnce();
  },
};

export const AccessibleNames: Story = {
  render: () => ({
    template:
      '<span id="close-label">Close panel</span><button atrIconButton type="button" aria-labelledby="close-label"><atr-icon name="close" /></button>',
  }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> <section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section><section data-atr-surface="elevated" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section><section data-atr-surface="transparent" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section><section data-atr-surface="glass" style="padding:2rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-icon-button-shape:1rem"><button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> </div>',
  }),
};
export const FocusVisible: Story = {
  render: () => ({
    template:
      '<button atrIconButton type="button" appearance="standard" aria-label="standard close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="filled" aria-label="filled close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="tonal" aria-label="tonal close"><atr-icon name="close" /></button> <button atrIconButton type="button" appearance="outlined" aria-label="outlined close"><atr-icon name="close" /></button> ',
  }),
  play: async ({ canvasElement }) => {
    const target = within(canvasElement).getAllByRole("button")[0];
    await userEvent.tab();
    await expect(target).toHaveFocus();
    await expect(target.matches(":focus-visible")).toBe(true);
  },
};
export const Interaction: Story = {
  render: () => ({
    props: { clicks: 0 },
    template:
      '<button atrIconButton type="button" aria-label="Save" (click)="clicks=clicks+1"><atr-icon name="check" /></button><p role="status">Clicks: {{clicks}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("Clicks: 1");
  },
};
