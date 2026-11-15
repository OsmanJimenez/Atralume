import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeKbd } from "@osmanjimenez/atralume/kbd";
import { AtralumeTooltip } from "@osmanjimenez/atralume/tooltip";

/**
 * Composition recipe: Tooltip naming plus Kbd chord affordance.
 * Not a package — compose Tooltip and Kbd.
 */
const meta = {
  title: "Patterns/Shortcut Hint",
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({
      imports: [AtralumeButton, AtralumeKbd, AtralumeTooltip],
    }),
  ],
  args: {
    action: "Save",
    chord: "Ctrl+S",
  },
  argTypes: {
    action: { control: "text" },
    chord: { control: "text" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button
        atrButton
        type="button"
        [atrTooltip]="action + ' (' + chord + ')'"
        tooltipId="shortcut-hint-tooltip"
      >
        {{ action }}
        <kbd atrKbd style="margin-inline-start: var(--atr-sys-spacing-sm)">{{
          chord
        }}</kbd>
      </button>
    `,
  }),
};

export const InlineLegend: Story = {
  render: () => ({
    template: `
      <p>
        Press
        <kbd atrKbd>Ctrl</kbd>
        +
        <kbd atrKbd>K</kbd>
        to open the command palette.
      </p>
    `,
  }),
};
