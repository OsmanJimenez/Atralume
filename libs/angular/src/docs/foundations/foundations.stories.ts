import type { Meta, StoryObj } from "@storybook/angular";
import { TokenTableComponent } from "../components/token-table/token-table.component";

const meta: Meta<TokenTableComponent> = {
  title: "Foundations/Generated Tokens",
  component: TokenTableComponent,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<TokenTableComponent>;

export const System: Story = { args: { prefix: "atr.sys." } };
export const Reference: Story = { args: { prefix: "atr.ref." } };
export const Button: Story = { args: { prefix: "atr.comp.button." } };
