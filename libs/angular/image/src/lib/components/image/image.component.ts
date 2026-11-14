import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { AtralumeSkeleton } from "@osmanjimenez/atralume/skeleton";

export type AtralumeImageFit =
  "cover" | "contain" | "fill" | "none" | "scale-down";
export type AtralumeImageAspectRatio =
  "auto" | "square" | "landscape" | "portrait" | number;
export type AtralumeImageState = "loading" | "loaded" | "error" | "empty";

/** Native responsive image with stable dimensions and tokenized load states. */
@Component({
  selector: "atr-image",
  standalone: true,
  imports: [AtralumeSkeleton],
  templateUrl: "./image.component.html",
  styleUrl: "./image.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-image",
    "[attr.data-state]": "state()",
    "[attr.data-aspect-ratio]": "aspectRatioName()",
    "[style.aspect-ratio]": "resolvedAspectRatio()",
  },
})
export class AtralumeImage {
  readonly src = input<string | null>(null);
  readonly alt = input.required<string>();
  readonly fallbackSrc = input<string | null>(null);
  readonly loading = input<"lazy" | "eager">("lazy");
  readonly fit = input<AtralumeImageFit>("cover");
  readonly position = input("center");
  readonly aspectRatio = input<AtralumeImageAspectRatio>("auto");
  readonly width = input<number | null>(null);
  readonly height = input<number | null>(null);
  readonly previewable = input(false, { transform: booleanAttribute });
  readonly previewLabel = input("Open image preview");
  readonly stateChange = output<AtralumeImageState>();
  readonly previewRequested = output<MouseEvent>();

  protected readonly state = signal<AtralumeImageState>("loading");
  private readonly failedPrimary = signal<string | null>(null);
  private readonly failedFallback = signal<string | null>(null);
  protected readonly activeSrc = computed(() => {
    const source = this.src();
    if (!source) return null;
    const fallback = this.fallbackSrc();
    return this.failedPrimary() === source && fallback ? fallback : source;
  });
  protected readonly imageAvailable = computed(
    () => !!this.activeSrc() && this.failedFallback() !== this.activeSrc(),
  );
  protected readonly resolvedAspectRatio = computed(() => {
    const ratio = this.aspectRatio();
    if (typeof ratio === "number") return ratio > 0 ? String(ratio) : null;
    if (ratio === "auto") return null;
    return ({ square: "1", landscape: "16 / 9", portrait: "3 / 4" } as const)[
      ratio
    ];
  });
  protected readonly aspectRatioName = computed(() =>
    typeof this.aspectRatio() === "number" ? "custom" : this.aspectRatio(),
  );

  protected loaded(): void {
    this.state.set("loaded");
    this.stateChange.emit("loaded");
  }

  protected failed(): void {
    const source = this.activeSrc();
    if (!source) return;
    if (source === this.src() && this.fallbackSrc()) {
      this.failedPrimary.set(source);
      this.state.set("loading");
      this.stateChange.emit("loading");
      return;
    }
    this.failedFallback.set(source);
    this.state.set("error");
    this.stateChange.emit("error");
  }

  protected requestPreview(event: MouseEvent): void {
    this.previewRequested.emit(event);
  }
}
