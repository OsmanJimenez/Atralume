import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeCard } from "@osmanjimenez/atralume/card";
import { AtralumeEmptyState } from "@osmanjimenez/atralume/empty-state";
import {
  AtralumeFilter,
  type AtralumeFilterOption,
} from "@osmanjimenez/atralume/filter";
import {
  AtralumeImageGallery,
  type AtralumeGalleryImage,
} from "@osmanjimenez/atralume/image-gallery";
import { AtralumeImage } from "@osmanjimenez/atralume/image";
import {
  AtralumeImagePreview,
  type AtralumePreviewImage,
} from "@osmanjimenez/atralume/image-preview";

interface Destination extends AtralumeGalleryImage {
  readonly tags: readonly string[];
  readonly meta: string;
}

const destinations: readonly Destination[] = [
  {
    id: "lake",
    src: "/images/explore/laguna-siecha.png",
    alt: "Turquoise alpine lake surrounded by mountains",
    title: "Laguna de Siecha",
    description: "A quiet highland trail for an unhurried day outdoors.",
    location: "Cundinamarca",
    meta: "2 h · sendero fácil",
    tags: ["nature", "easy", "water"],
    width: 1600,
    height: 1067,
  },
  {
    id: "forest",
    src: "/images/explore/bosque-niebla.png",
    alt: "Sunlight entering a dense green forest",
    title: "Bosque de Niebla",
    description: "Soft light, birdlife and a forest path after the rain.",
    location: "Boyacá",
    meta: "Fin de semana · 4 h",
    tags: ["nature", "weekend"],
    width: 1600,
    height: 1067,
  },
  {
    id: "coast",
    src: "/images/explore/cabo-vela.png",
    alt: "Waves breaking on a bright tropical coast",
    title: "Cabo de la Vela",
    description: "Salt air, long horizons and an early morning swim.",
    location: "La Guajira",
    meta: "Costa · marea baja",
    tags: ["water", "weekend"],
    width: 1600,
    height: 1067,
  },
  {
    id: "waterfall",
    src: "/images/explore/cascada-verde.jpg",
    alt: "Misty waterfall cascading into a rocky pool",
    title: "Cascada Verde",
    description: "Cool spray, short climbs and a still pool for a pause.",
    location: "Santander",
    meta: "Media mañana · 3 h",
    tags: ["nature", "water", "easy"],
    width: 1600,
    height: 1067,
  },
  {
    id: "dunes",
    src: "/images/explore/dunas-tatacoa.jpg",
    alt: "Desert dunes glowing at golden hour",
    title: "Dunas de Tatacoa",
    description: "Warm sand underfoot and a wide sky before dusk.",
    location: "Huila",
    meta: "Atardecer · fácil",
    tags: ["nature", "easy", "weekend"],
    width: 1600,
    height: 1067,
  },
  {
    id: "plaza",
    src: "/images/explore/plaza-blanca.jpg",
    alt: "Quiet whitewashed plaza with flowering trees",
    title: "Plaza Blanca",
    description: "Slow streets, shade and a coffee before the next stop.",
    location: "Santander",
    meta: "Pueblo · medio día",
    tags: ["weekend", "easy"],
    width: 1600,
    height: 1067,
  },
];

@Component({
  selector: "atr-exploration-demo",
  imports: [
    FormsModule,
    AtralumeButton,
    AtralumeCard,
    AtralumeEmptyState,
    AtralumeFilter,
    AtralumeImage,
    AtralumeImageGallery,
    AtralumeImagePreview,
  ],
  templateUrl: "./exploration-demo.component.html",
  styleUrl: "./exploration-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorationDemo {
  readonly theme = input<"light" | "dark">("light");
  readonly themeToggle = output<void>();

  protected readonly allDestinations = destinations;
  protected readonly filters: readonly AtralumeFilterOption<string>[] = [
    { value: "nature", label: "Naturaleza", badge: 4 },
    { value: "weekend", label: "Fin de semana", badge: 4 },
    { value: "water", label: "Agua", badge: 3 },
    { value: "easy", label: "Fácil", badge: 4 },
  ];
  protected readonly selectedFilters = signal<readonly string[]>(["nature"]);
  protected readonly activeIndex = signal(0);
  protected readonly forceEmpty = signal(false);

  protected readonly visibleDestinations = computed(() => {
    if (this.forceEmpty()) {
      return [] as readonly Destination[];
    }
    const selected = this.selectedFilters();
    if (!selected.length) {
      return this.allDestinations;
    }
    return this.allDestinations.filter((destination) =>
      selected.some((tag) => destination.tags.includes(tag)),
    );
  });

  protected readonly featured = computed(
    () => this.visibleDestinations()[0] ?? this.allDestinations[0],
  );

  protected readonly featuredPreview = computed<readonly AtralumePreviewImage[]>(
    () => [this.featured()],
  );

  protected readonly resultLabel = computed(() => {
    const count = this.visibleDestinations().length;
    if (!count) {
      return "Sin coincidencias";
    }
    return count === 1
      ? "1 lugar seleccionado para ti"
      : `${count} lugares seleccionados para ti`;
  });

  protected updateFilters(filters: readonly string[]): void {
    this.forceEmpty.set(false);
    this.selectedFilters.set(filters);
    this.activeIndex.set(0);
  }

  protected reset(): void {
    this.forceEmpty.set(false);
    this.selectedFilters.set(["nature"]);
    this.activeIndex.set(0);
  }

  protected showEmpty(): void {
    this.forceEmpty.set(true);
  }
}
