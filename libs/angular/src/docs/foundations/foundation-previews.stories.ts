import type { Meta, StoryObj } from "@storybook/angular";
import {
  FoundationPreviewComponent,
  type FoundationPreviewKind,
} from "../components/foundation-preview/foundation-preview.component";

const meta: Meta<FoundationPreviewComponent> = {
  title: "Foundations/Previews",
  component: FoundationPreviewComponent,
  tags: ["!autodocs"],
};

export default meta;

type PreviewStory = StoryObj<FoundationPreviewComponent>;

const foundation = (kind: FoundationPreviewKind): PreviewStory => ({
  args: { kind },
});

export const Overview = foundation("overview");
export const Color = foundation("color");
export const Elevation = foundation("elevation");
export const Focus = foundation("focus");
export const Glass = foundation("glass");
export const Motion = foundation("motion");
export const Shape = foundation("shape");
export const Spacing = foundation("spacing");
export const State = foundation("state");
export const Surfaces = foundation("surfaces");
export const Typography = foundation("typography");
