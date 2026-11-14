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
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium"] },
  },
  render: (args) => ({
    props: args,
    template: '<kbd atrKbd [size]="size">Ctrl</kbd>',
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
