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
