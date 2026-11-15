import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeKbd } from "../../index";

export default {
  component: AtralumeKbd,
  title: "Atoms/Kbd",
  decorators: [
    moduleMetadata({
      imports: [AtralumeKbd],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    size: "medium",
    label: "Ctrl",
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium"] },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template: `
      <p style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
        Press
        <kbd atrKbd [size]="size">{{ label }}</kbd>
        to trigger the shortcut.
      </p>
    `,
  }),
};

export const ShortcutHint: Story = {
  render: () => ({
    template: `
      <p>
        Open the command palette with
        <kbd atrKbd>Ctrl</kbd>
        +
        <kbd atrKbd>K</kbd>
      </p>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <p>
        <kbd atrKbd size="small">Esc</kbd>
        <kbd atrKbd size="medium">Enter</kbd>
      </p>
    `,
  }),
};
