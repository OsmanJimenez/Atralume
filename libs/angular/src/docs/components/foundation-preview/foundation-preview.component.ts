import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

export type FoundationPreviewKind =
  | "overview"
  | "color"
  | "elevation"
  | "focus"
  | "glass"
  | "motion"
  | "shape"
  | "spacing"
  | "state"
  | "surfaces"
  | "typography";

@Component({
  selector: "atr-doc-foundation-preview",
  standalone: true,
  templateUrl: "./foundation-preview.component.html",
  styleUrl: "./foundation-preview.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationPreviewComponent {
  readonly kind = input<FoundationPreviewKind>("overview");
  protected readonly pressed = signal(false);
  protected readonly motionRun = signal(0);

  protected togglePressed(): void {
    this.pressed.update((value) => !value);
  }

  protected replayMotion(): void {
    this.motionRun.update((value) => value + 1);
  }
}
