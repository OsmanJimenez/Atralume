import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
} from "../../index";
export default {
  title: "Composition/Card",
  component: AtralumeCard,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeButton,
        AtralumeAvatar,
        AtralumeCard,
        AtralumeCardHeader,
        AtralumeCardContent,
        AtralumeCardActions,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Playground: Story = {
  args: { appearance: "elevated" },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "elevated", "outlined", "glass"],
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-card [appearance]="appearance"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card>',
  }),
};
