import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeStatus } from "../../index";

export default {
  component: AtralumeStatus,
  title: "Atoms/Status",
  decorators: [
    moduleMetadata({
      imports: [AtralumeStatus],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    tone: "neutral",
    size: "medium",
    color: "",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "success", "warning", "error", "info", "primary"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    color: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<span atrStatus [tone]="tone" [size]="size" [color]="color">Status</span>',
  }),
};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:0.5rem">
        <span atrStatus tone="neutral">Neutral</span>
        <span atrStatus tone="success">Online</span>
        <span atrStatus tone="warning">Degraded</span>
        <span atrStatus tone="error">Offline</span>
        <span atrStatus tone="info">Syncing</span>
        <span atrStatus tone="primary">Primary</span>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:0.5rem">
        <span atrStatus tone="success" size="small">Small</span>
        <span atrStatus tone="success" size="medium">Medium</span>
        <span atrStatus tone="success" size="large">Large</span>
      </div>
    `,
  }),
};
