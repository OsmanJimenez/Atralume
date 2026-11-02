import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import {
  AtralumeBreadcrumbs,
  AtralumeBreadcrumbItem,
  AtralumeBreadcrumbSeparator,
  AtralumeBreadcrumbOverflow,
} from "../../index";
export default {
  title: "Navigation/Breadcrumbs",
  component: AtralumeBreadcrumbs,
  tags: ["!autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AtralumeBreadcrumbs,
        AtralumeBreadcrumbItem,
        AtralumeBreadcrumbSeparator,
        AtralumeBreadcrumbOverflow,
      ],
    }),
  ],
} satisfies Meta;
type Story = StoryObj;
export const Default: Story = {
  render: () => ({
    template:
      '<nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav>',
  }),
};
export const Light: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="standard" style="padding:2rem"><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav></section></div>',
  }),
};
export const Dark: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="dark" data-atr-surface="standard" style="padding:2rem"><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav></section></div>',
  }),
};
export const OnGlass: Story = {
  render: () => ({
    template:
      '<div style="padding:2rem;background:linear-gradient(120deg,var(--atr-sys-color-primary-container),var(--atr-sys-color-tertiary-container))"><section class="atr-scope" data-atr-theme="light" data-atr-surface="glass" style="padding:2rem"><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav></section></div>',
  }),
};
export const NestedTheme: Story = {
  render: () => ({
    template:
      '<section data-atr-theme="dark" data-atr-surface="standard" style="padding:1rem"><section data-atr-theme="light" data-atr-surface="standard" dir="rtl" style="padding:1rem"><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav></section></section>',
  }),
};
export const ConsumerOverride: Story = {
  render: () => ({
    template:
      '<section style="--atr-comp-breadcrumbs-shape:1.5rem;--atr-comp-breadcrumbs-gap:1rem"><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav></section>',
  }),
};
