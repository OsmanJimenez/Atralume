import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeCard, AtralumeCardContent, AtralumeCardHeader } from "@osmanjimenez/atralume/card";
import { AtralumeGrid, AtralumeGridItem } from "../../index";

export default {
  title: "Composition/Grid",
  component: AtralumeGrid,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeGrid,
        AtralumeGridItem,
        AtralumeCard,
        AtralumeCardHeader,
        AtralumeCardContent,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    columns: 3,
    gap: "md",
    minTrack: "14rem",
  },
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 6, step: 1 } },
    gap: { control: "select", options: ["none", "xs", "sm", "md", "lg", "xl"] },
    minTrack: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template: `
      <atr-grid [columns]="columns" [gap]="gap" [minTrack]="minTrack">
        <atr-card appearance="elevated"><header atrCardHeader><h2>Alpha</h2></header><div atrCardContent>Primary tile.</div></atr-card>
        <atr-card appearance="outlined"><header atrCardHeader><h2>Beta</h2></header><div atrCardContent>Secondary tile.</div></atr-card>
        <atr-card appearance="filled"><header atrCardHeader><h2>Gamma</h2></header><div atrCardContent>Filled tile.</div></atr-card>
        <atr-card appearance="elevated"><header atrCardHeader><h2>Delta</h2></header><div atrCardContent>Fourth tile wraps.</div></atr-card>
      </atr-grid>
    `,
  }),
};

export const AutoFill: Story = {
  render: () => ({
    template: `
      <atr-grid columns="auto" gap="md" minTrack="12rem">
        <atr-card appearance="elevated"><header atrCardHeader><h2>One</h2></header><div atrCardContent>Auto track.</div></atr-card>
        <atr-card appearance="elevated"><header atrCardHeader><h2>Two</h2></header><div atrCardContent>Auto track.</div></atr-card>
        <atr-card appearance="elevated"><header atrCardHeader><h2>Three</h2></header><div atrCardContent>Auto track.</div></atr-card>
        <atr-card appearance="elevated"><header atrCardHeader><h2>Four</h2></header><div atrCardContent>Auto track.</div></atr-card>
      </atr-grid>
    `,
  }),
};

export const WithSpans: Story = {
  render: () => ({
    template: `
      <atr-grid [columns]="4" gap="md">
        <div atrGridItem span="full" style="padding:1rem;border-radius:12px;background:var(--atr-sys-color-primary-container);color:var(--atr-sys-color-on-primary-container)">Full width banner</div>
        <atr-card atrGridItem appearance="elevated"><header atrCardHeader><h2>A</h2></header><div atrCardContent>Span 1</div></atr-card>
        <atr-card atrGridItem [span]="2" appearance="elevated"><header atrCardHeader><h2>B</h2></header><div atrCardContent>Span 2</div></atr-card>
        <atr-card atrGridItem appearance="outlined"><header atrCardHeader><h2>C</h2></header><div atrCardContent>Span 1</div></atr-card>
      </atr-grid>
    `,
  }),
};
