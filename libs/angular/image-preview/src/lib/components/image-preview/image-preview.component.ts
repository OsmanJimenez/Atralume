import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeDialog,
  AtralumeDialogRef,
  ATR_DIALOG_DATA,
} from "@osmanjimenez/atralume/dialog";
import { TuiPreview } from "@taiga-ui/kit";

export interface AtralumePreviewImage {
  readonly src: string;
  readonly alt: string;
  readonly title?: string;
  readonly description?: string;
  readonly fallbackSrc?: string;
}

interface AtralumePreviewDialogData {
  readonly images: readonly AtralumePreviewImage[];
  readonly index: number;
  readonly zoomable: boolean;
  readonly rotatable: boolean;
  readonly label: string;
}

@Component({
  selector: "atr-image-preview-panel",
  standalone: true,
  imports: [AtralumeButton, TuiPreview],
  templateUrl: "./image-preview-panel.component.html",
  styleUrl: "./image-preview-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-image-preview-panel" },
})
class AtralumeImagePreviewPanel {
  protected readonly data = inject<AtralumePreviewDialogData>(ATR_DIALOG_DATA);
  private readonly ref = inject(AtralumeDialogRef<void>);
  protected readonly activeIndex = signal(this.data.index);
  protected readonly failedSource = signal<string | null>(null);
  protected readonly image = computed(
    () => this.data.images[this.activeIndex()] ?? null,
  );
  protected readonly hasPrevious = computed(() => this.activeIndex() > 0);
  protected readonly hasNext = computed(
    () => this.activeIndex() < this.data.images.length - 1,
  );
  protected readonly zoomable = this.data.zoomable;
  protected readonly rotatable = this.data.rotatable;
  protected readonly label = this.data.label;
  protected previous(): void {
    if (this.hasPrevious()) this.activeIndex.update((index) => index - 1);
  }
  protected next(): void {
    if (this.hasNext()) this.activeIndex.update((index) => index + 1);
  }
  protected close(): void {
    this.ref.close();
  }
  protected failed(): void {
    this.failedSource.set(this.image()?.src ?? null);
  }
}

/** A trigger that presents one or more images in the shared Atralume dialog with Taiga zoom. */
@Component({
  selector: "atr-image-preview",
  standalone: true,
  templateUrl: "./image-preview.component.html",
  styleUrl: "./image-preview.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-image-preview" },
})
export class AtralumeImagePreview {
  readonly images = input.required<readonly AtralumePreviewImage[]>();
  readonly activeIndex = model(0);
  readonly label = input("Image preview");
  readonly triggerLabel = input("Open image preview");
  readonly zoomable = input(true, { transform: booleanAttribute });
  readonly rotatable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly showTrigger = input(true, { transform: booleanAttribute });
  readonly closed = output<void>();
  private readonly dialog = inject(AtralumeDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly trigger =
    viewChild<ElementRef<HTMLButtonElement>>("trigger");

  open(origin: HTMLElement | undefined = this.trigger()?.nativeElement): void {
    const images = this.images();
    if (!images.length || this.disabled()) return;
    const index = Math.min(Math.max(0, this.activeIndex()), images.length - 1);
    this.activeIndex.set(index);
    this.dialog
      .open<AtralumeImagePreviewPanel, AtralumePreviewDialogData, void>(
        AtralumeImagePreviewPanel,
        {
          data: {
            images,
            index,
            zoomable: this.zoomable(),
            rotatable: this.rotatable(),
            label: this.label(),
          },
          // Accessible name on the modal; visual chrome lives in the panel.
          label: this.label(),
          appearance: "atr-image-preview",
          size: "l",
          closable: false,
          origin,
          restoreFocus: true,
        },
      )
      .afterClosed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closed.emit());
  }
}
