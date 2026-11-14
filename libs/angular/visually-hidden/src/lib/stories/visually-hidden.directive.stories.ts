import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeVisuallyHidden } from "../../index";

export default {
  component: AtralumeVisuallyHidden,
  title: "Atoms/Visually Hidden",
  decorators: [
    moduleMetadata({
      imports: [AtralumeVisuallyHidden],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    focusable: false,
  },
  argTypes: {
    focusable: { control: "boolean" },
  },
  render: (args) => ({
    props: args,
    template: `
      <p>
        Visible label
        <span atrVisuallyHidden [focusable]="focusable"> (hidden hint)</span>
      </p>
    `,
  }),
};

export const SkipLink: Story = {
  render: () => ({
    template: `
      <a href="#main" atrVisuallyHidden focusable>Skip to main content</a>
      <p id="main" tabindex="-1">Main content. Tab to the skip link above to reveal it.</p>
    `,
  }),
};

export const ScreenReaderOnly: Story = {
  render: () => ({
    template: `
      <button type="button">
        <span aria-hidden="true">×</span>
        <span atrVisuallyHidden>Close dialog</span>
      </button>
    `,
  }),
};
