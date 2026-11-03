import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeCarousel } from "../components/carousel/carousel.component";
const slides = [{ id: "foundations", label: "Foundations", description: "Tokens and themes." }, { id: "controls", label: "Controls", description: "Accessible interactions." }, { id: "data", label: "Data", description: "Structured content." }];
const meta = { title: "Media/Carousel", component: AtralumeCarousel, decorators: [moduleMetadata({ imports: [AtralumeCarousel] })], args: { label: "Atralume catalogue", slides } } satisfies Meta<AtralumeCarousel>;
export default meta; type Story = StoryObj<AtralumeCarousel>;
export const Playground: Story = {
  args: { loop: false, autoplay: false, autoplayDelay: 2500 },
  argTypes: {
    label: { control: "text" },
    loop: { control: "boolean" },
    autoplay: { control: "boolean" },
    autoplayDelay: { control: "number" },
    slides: { control: false },
  },
};
