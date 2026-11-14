import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeTruncatedText } from "../../index";

const lorem =
  "Atralume keeps long product descriptions readable by clamping lines with Taiga LineClamp. " +
  "Consumers pass the full string through the content input and choose how many lines remain visible. " +
  "When the text overflows, an optional hint surfaces the remainder without custom measurement code.";

const meta = {
  title: "Atoms/Truncated Text",
  component: AtralumeTruncatedText,
  tags: ["!autodocs"],
  decorators: [moduleMetadata({ imports: [AtralumeTruncatedText] })],
  args: {
    content: lorem,
    lines: 2,
    lineHeight: 24,
    showHint: true,
  },
  argTypes: {
    content: { control: "text" },
    lines: { control: { type: "number", min: 1, max: 8 } },
    lineHeight: { control: { type: "number", min: 16, max: 40 } },
    showHint: { control: "boolean" },
  },
} satisfies Meta<AtralumeTruncatedText>;

export default meta;
type Story = StoryObj<AtralumeTruncatedText>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="max-inline-size: 20rem">
        <atr-truncated-text
          [content]="content"
          [lines]="lines"
          [lineHeight]="lineHeight"
          [showHint]="showHint"
        />
      </div>
    `,
  }),
};

export const SingleLine: Story = {
  args: { lines: 1 },
  render: Playground.render,
};

export const ThreeLines: Story = {
  args: { lines: 3 },
  render: Playground.render,
};
