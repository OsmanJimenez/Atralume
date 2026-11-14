import { Clipboard } from "@angular/cdk/clipboard";
import {
  DestroyRef,
  Directive,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TuiButton, tuiButtonOptionsProvider } from "@taiga-ui/core";
import { timer } from "rxjs";

/**
 * Brand adapter for clipboard copy on a native button.
 * Mirrors Taiga `TuiButtonCopy` (CDK Clipboard + `TuiButton`) because
 * `TuiButtonCopy` is an attribute component and cannot be used in hostDirectives.
 */
@Directive({
  selector: "button[atrCopyButton]",
  standalone: true,
  providers: [
    tuiButtonOptionsProvider({ appearance: "flat-grayscale", size: "s" }),
  ],
  hostDirectives: [TuiButton],
  host: {
    class: "atr-copy-button",
    type: "button",
    "[attr.tuiButton]": '""',
    "[attr.tuiButtonCopy]": "text()",
    "[attr.data-copied]": 'copied() ? "true" : null',
    "(click)": "onCopy()",
  },
})
export class AtralumeCopyButton {
  private readonly clipboard = inject(Clipboard);
  private readonly destroyRef = inject(DestroyRef);

  /** String written to the clipboard (Taiga `tuiButtonCopy` equivalent). */
  readonly text = input("");

  protected readonly copied = signal(false);

  protected onCopy(): void {
    this.clipboard.copy(this.text());
    this.copied.set(true);
    timer(2000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.copied.set(false));
  }
}
