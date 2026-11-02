import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, waitFor, within } from "storybook/test";
import { AtralumeAvatar } from "../../index";
export default {
  component: AtralumeAvatar,
  title: "Atoms/Avatar",
  decorators: [
    moduleMetadata({
      imports: [AtralumeAvatar],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: {
    src: "",
    alt: "Alex Morgan",
    name: "Alex Morgan",
    initials: "",
    size: "medium",
    shape: "circle",
    loading: "lazy",
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    name: { control: "text" },
    initials: { control: "text" },
    size: {
      control: "select",
      options: ["small", "medium", "large", "x-large"],
    },
    shape: { control: "select", options: ["circle", "rounded"] },
    loading: { control: "select", options: ["lazy", "eager"] },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-avatar [src]="src" [alt]="alt" [name]="name" [initials]="initials" [size]="size" [shape]="shape" [loading]="loading"></atr-avatar>',
  }),
};

export const BrokenImage: Story = {
  render: () => ({
    template:
      '<atr-avatar loading="eager" src="data:image/png;base64,broken" name="Osman Jim\u00e9nez" alt="Osman Jim\u00e9nez" />',
  }),
  play: async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(
          within(canvasElement).getByRole("img", { name: "Osman Jiménez" }),
        ).toHaveTextContent("OJ"),
      { timeout: 5000 },
    );
  },
};

export const Themes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><p>light</p><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section><section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><p>dark</p><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section><section data-atr-theme="system" data-atr-surface="standard" style="padding:2rem"><p>system</p><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section>',
  }),
};

export const NestedThemes: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /><section data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section></section>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:3rem;background:radial-gradient(circle at 20% 30%,var(--atr-sys-color-primary),transparent),linear-gradient(120deg,var(--atr-sys-color-tertiary-container),var(--atr-sys-color-secondary-container))"><section data-atr-surface="glass" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section></div>',
  }),
};
export const Surfaces: Story = {
  render: () => ({
    template:
      '<section data-atr-surface="standard" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section><section data-atr-surface="elevated" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section><section data-atr-surface="transparent" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section><section data-atr-surface="glass" style="padding:2rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<div style="--atr-comp-avatar-rounded-shape:1rem"><atr-avatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%236b4aa0%22/%3E%3Ccircle cx=%2232%22 cy=%2226%22 r=%2212%22 fill=%22%23fff%22/%3E%3Cpath d=%22M12 64a20 24 0 0 1 40 0%22 fill=%22%23fff%22/%3E%3C/svg%3E" alt="Profile illustration" /></div>',
  }),
};
