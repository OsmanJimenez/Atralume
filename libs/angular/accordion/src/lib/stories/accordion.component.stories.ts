import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { TuiAccordion } from "@taiga-ui/kit";
import { expect, userEvent, within } from "storybook/test";
import {
  AtralumeAccordionItem,
  AtralumeAccordionHeader,
  AtralumeAccordionPanel,
} from "../../index";

export default {
  title: "Composition/Accordion",
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        TuiAccordion,
        AtralumeAccordionItem,
        AtralumeAccordionHeader,
        AtralumeAccordionPanel,
      ],
    }),
  ],
  args: {
    multi: false,
  },
  argTypes: {
    multi: { control: "boolean" },
  },
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tui-accordion [closeOthers]="!multi" class="atr-accordion">
        <atr-accordion-item id="profile">
          <span atrAccordionHeader>Profile</span>
          <p atrAccordionPanel>Profile details</p>
        </atr-accordion-item>
        <atr-accordion-item id="security">
          <span atrAccordionHeader>Security</span>
          <p atrAccordionPanel>Security details</p>
        </atr-accordion-item>
      </tui-accordion>
    `,
  }),
};

export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const first = c.getByRole("button", { name: /Profile/ });
    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const second = c.getByRole("button", { name: /Security/ });
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  },
};
