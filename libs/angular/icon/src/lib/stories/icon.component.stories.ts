import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeIcon } from "../components/icon/icon.component";
import { provideAtralumeIcons } from "../providers/provide-icons";
import {
  checkIcon,
  closeIcon,
  arrowRightIcon,
  chevronDownIcon,
  infoIcon,
  warningIcon,
  userIcon,
  menuIcon,
} from "../icons/icons";

export default {
  component: AtralumeIcon,
  title: "Atoms/Icon",
  decorators: [
    moduleMetadata({
      imports: [AtralumeIcon],
      providers: [
        provideAtralumeIcons([
          checkIcon,
          closeIcon,
          arrowRightIcon,
          chevronDownIcon,
          infoIcon,
          warningIcon,
          userIcon,
          menuIcon,
        ]),
      ],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    name: "check",
    size: "medium",
    decorative: true,
    label: "Check icon",
  },
  argTypes: {
    name: {
      control: "select",
      options: [
        "check",
        "close",
        "arrow-right",
        "chevron-down",
        "info",
        "warning",
        "user",
        "menu",
      ],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large", 48],
    },
    decorative: { control: "boolean" },
    label: { control: "text" },
  },
  render: (args) => ({
    props: args,
    template:
      '<atr-icon [name]="name" [size]="size" [decorative]="decorative" [label]="label"></atr-icon>',
  }),
};

/** Built-in registry sample only (8). Full Taiga catalogue: Foundations → Icon Explorer. */
export const Gallery: Story = {
  render: () => ({
    template: `
      <p style="margin:0 0 1rem;max-inline-size:40rem">
        Structured registry built-ins (8). Browse all ~2,183 Taiga / Lucide names with
        copyable <code>@tui.*</code> codes in <strong>Foundations / Icon Explorer</strong>.
      </p>
      <ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(7rem,1fr));gap:0.75rem;list-style:none;margin:0;padding:0">
        @for (item of items; track item.name) {
          <li style="display:grid;gap:0.35rem;justify-items:center;padding:0.75rem;border:1px solid var(--atr-sys-color-outline-variant);border-radius:0.75rem">
            <atr-icon [name]="item.name" [decorative]="false" [label]="item.name" size="large" />
            <strong style="font-size:0.75rem">{{ item.name }}</strong>
            <code style="font-size:0.65rem;word-break:break-all">{{ item.code }}</code>
          </li>
        }
      </ul>
    `,
    props: {
      items: [
        { name: "check", code: "name=\"check\"" },
        { name: "close", code: "name=\"close\"" },
        { name: "arrow-right", code: "name=\"arrow-right\"" },
        { name: "chevron-down", code: "name=\"chevron-down\"" },
        { name: "info", code: "name=\"info\"" },
        { name: "warning", code: "name=\"warning\"" },
        { name: "user", code: "name=\"user\"" },
        { name: "menu", code: "name=\"menu\"" },
      ],
    },
  }),
};

export const TaigaBridge: Story = {
  name: "Taiga bridge",
  render: () => ({
    template:
      '<atr-icon engine="tui" name="@tui.check" [decorative]="false" label="Taiga check" /> <atr-icon engine="tui" name="@tui.heart" [decorative]="false" label="Taiga heart" /> <atr-icon engine="auto" name="sparkles" [decorative]="false" label="Auto sparkles" />',
  }),
};
