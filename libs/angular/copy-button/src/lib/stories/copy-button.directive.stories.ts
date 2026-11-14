import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { expect, userEvent, within } from "storybook/test";
import { AtralumeCopyButton } from "../../index";

export default {
  component: AtralumeCopyButton,
  title: "Atoms/Copy Button",
  decorators: [
    moduleMetadata({
      imports: [AtralumeCopyButton],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    text: "npm i @atralume/angular",
  },
  argTypes: {
    text: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<button atrCopyButton type="button" [text]="text">Copy install command</button>',
  }),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: /copy install command/i,
    });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("data-copied", "true");
  },
};

export const FixedString: Story = {
  render: () => ({
    template:
      '<button atrCopyButton type="button" text="https://atralume.dev">Copy link</button>',
  }),
};
