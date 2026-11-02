import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeCarousel } from "../components/carousel/carousel.component";
const slides = [{ id: "foundations", label: "Foundations", description: "Tokens and themes." }, { id: "controls", label: "Controls", description: "Accessible interactions." }, { id: "data", label: "Data", description: "Structured content." }];
const meta = { title: "Media/Carousel", component: AtralumeCarousel, decorators: [moduleMetadata({ imports: [AtralumeCarousel] })], args: { label: "Atralume catalogue", slides } } satisfies Meta<AtralumeCarousel>;
export default meta; type Story = StoryObj<AtralumeCarousel>;
export const Default: Story = {};
export const Loop: Story = { args: { loop: true } };
export const Autoplay: Story = { args: { autoplay: true, autoplayDelay: 2500 } };
