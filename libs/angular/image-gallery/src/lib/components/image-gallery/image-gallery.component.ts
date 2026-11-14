import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { TuiItem } from "@taiga-ui/cdk/directives/item";
import { TuiCarousel } from "@taiga-ui/core";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeEmptyState } from "@osmanjimenez/atralume/empty-state";
import { AtralumeImage } from "@osmanjimenez/atralume/image";
import {
  AtralumeImagePreview,
  type AtralumePreviewImage,
} from "@osmanjimenez/atralume/image-preview";

export type AtralumeImageGalleryLayout = "carousel" | "mosaic";

export interface AtralumeGalleryImage extends AtralumePreviewImage {
  readonly id: string;
  readonly width?: number;
  readonly height?: number;
  readonly location?: string;
  readonly tags?: readonly string[];
}

/** Responsive image collection composed from Taiga carousel, Atralume Image, and Atralume Preview. */
@Component({
  selector: "atr-image-gallery",
  standalone: true,
  imports: [
    TuiCarousel,
    TuiItem,
    AtralumeButton,
    AtralumeEmptyState,
    AtralumeImage,
    AtralumeImagePreview,
  ],
  templateUrl: "./image-gallery.component.html",
  styleUrl: "./image-gallery.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-image-gallery",
    "[attr.aria-label]": "label()",
    "[attr.data-layout]": "layout()",
  },
})
export class AtralumeImageGallery {
  readonly images = input<readonly AtralumeGalleryImage[]>([]);
  readonly label = input("Image gallery");
  readonly layout = input<AtralumeImageGalleryLayout>("carousel");
  readonly activeIndex = model(0);
  readonly loop = input(false, { transform: booleanAttribute });
  readonly showThumbnails = input(true, { transform: booleanAttribute });
  readonly showCaptions = input(true, { transform: booleanAttribute });
  readonly previewable = input(true, { transform: booleanAttribute });
  readonly activeChange = output<number>();
  protected readonly preview = viewChild(AtralumeImagePreview);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly max = computed(() =>
    Math.max(0, this.images().length - 1),
  );
  protected readonly current = computed(
    () => this.images()[this.activeIndex()] ?? null,
  );
  protected readonly previewImages = computed<readonly AtralumePreviewImage[]>(
    () => this.images(),
  );
  protected readonly isMosaic = computed(() => this.layout() === "mosaic");

  protected onIndex(index: number): void {
    const next = Math.min(Math.max(0, index), this.max());
    this.activeIndex.set(next);
    this.activeChange.emit(next);
  }

  protected previous(): void {
    this.onIndex(
      this.activeIndex() <= 0
        ? this.loop()
          ? this.max()
          : 0
        : this.activeIndex() - 1,
    );
  }

  protected next(): void {
    this.onIndex(
      this.activeIndex() >= this.max()
        ? this.loop()
          ? 0
          : this.max()
        : this.activeIndex() + 1,
    );
  }

  protected openPreview(index: number, origin: MouseEvent): void {
    this.onIndex(index);
    this.preview()?.open(
      origin.currentTarget instanceof HTMLElement
        ? origin.currentTarget
        : this.element.nativeElement,
    );
  }

  protected selectTile(index: number, event: MouseEvent): void {
    this.onIndex(index);
    if (this.previewable()) {
      this.openPreview(index, event);
    }
  }
}
