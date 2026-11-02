import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AtralumeIcon,
  arrowRightIcon,
  infoIcon,
  provideAtralumeIcons,
} from "@atralume/angular/icon";
import { AtralumeLink } from "../../index";
export default {
  component: AtralumeLink,
  title: "Atoms/Link",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon, AtralumeLink],
      providers: [provideAtralumeIcons([arrowRightIcon, infoIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    label: "Documentation",
    href: "#documentation",
    appearance: "inline",
    underline: "always",
    onNavigate: fn(),
  },
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    appearance: { control: "select", options: ["inline", "standalone"] },
    underline: { control: "select", options: ["always", "hover"] },
    onNavigate: { control: false },
  },
  render: (args) => ({
    props: args,
    template:
      '<a atrLink [href]="href" [appearance]="appearance" [underline]="underline" (click)="onNavigate($event); $event.preventDefault()">{{label}}</a>',
  }),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("link", { name: args["label"] }),
    );
    await expect(args["onNavigate"]).toHaveBeenCalledOnce();
  },
};

export const IconPlacement: Story = {
  render: () => ({
    template:
      '<a atrLink appearance="standalone" href="#info"><atr-icon name="info" />About this page</a> <a atrLink appearance="standalone" href="#next">Continue<atr-icon name="arrow-right" /></a>',
  }),
};

export const ExternalExample: Story = {
  render: () => ({
    template:
      '<a atrLink href="https://angular.dev" target="_blank" rel="noopener noreferrer">Angular documentation (opens in a new tab)</a>',
  }),
};
export const Visited: Story = {
  render: () => ({
    template:
      '<p>Visit and return to inspect browser-controlled history styling: <a atrLink href="#visited-example">Visited example</a></p>',
  }),
};
export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p><section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section><section data-atr-surface="elevated" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section><section data-atr-surface="transparent" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section><section data-atr-surface="glass" style="padding:2rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-link-underline-offset:1rem"><p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p></div>',
  }),
};
export const FocusVisible: Story = {
  render: () => ({
    template:
      '<p>Read the <a atrLink href="#documentation">documentation</a> before continuing.</p>',
  }),
  play: async ({ canvasElement }) => {
    const target = within(canvasElement).getByRole("link", {
      name: /documentation/i,
    });
    await userEvent.tab();
    await expect(target).toHaveFocus();
    await expect(target.matches(":focus-visible")).toBe(true);
  },
};
export const Keyboard: Story = {
  render: () => ({
    props: { activated: false },
    template:
      '<a atrLink href="#keyboard-target" (click)="activated=true; $event.preventDefault()">Documentation</a><p role="status">Activated: {{activated}}</p>',
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Activated: true",
    );
  },
};
