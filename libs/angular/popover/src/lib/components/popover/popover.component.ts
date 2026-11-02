import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
  untracked,
  viewChild,
} from "@angular/core";
import {
  ɵAtralumeOverlayInfrastructure,
  ɵAtralumeControlIds,
  type ɵOverlayHandle,
} from "@atralume/angular";
export type PopoverPosition = "above" | "below" | "before" | "after";
export type PopoverFocus = "none" | "first" | "trap";
@Component({
  selector: "atr-popover",
  standalone: true,
  templateUrl: "./popover.component.html",
  styleUrl: "./popover.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-popover" },
})
export class AtralumePopover {
  readonly origin = input.required<HTMLElement>();
  readonly opened = model(false);
  readonly panelId = input<string>(inject(ɵAtralumeControlIds).create());
  readonly panelRole = input<"dialog" | "region" | "group" | null>(null);
  readonly label = input<string | null>(null);
  readonly position = input<PopoverPosition>("below");
  readonly focus = input<PopoverFocus>("none");
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly hasBackdrop = input(false, { transform: booleanAttribute });
  readonly arrow = input(false, { transform: booleanAttribute });
  private readonly template = viewChild.required<TemplateRef<unknown>>("panel");
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private readonly views = inject(ViewContainerRef);
  private readonly owner = inject(DestroyRef);
  private ref: ɵOverlayHandle<unknown> | null = null;
  constructor() {
    effect((onCleanup) => {
      const opened = this.opened();
      const template = this.template();
      const origin = this.origin();
      const position = this.position();
      const focus = this.focus();
      const restoreFocus = this.restoreFocus();
      const hasBackdrop = this.hasBackdrop();
      if (!opened) return;
      if (
        (this.panelRole() === "dialog" || this.panelRole() === "region") &&
        !this.label()?.trim()
      )
        throw new Error("Labelled popovers require an accessible label.");
      const ref = untracked(() =>
        this.engine.openConnected(template, this.views, origin, {
          owner: this.owner,
          position,
          focus,
          restoreFocus,
          hasBackdrop,
          panelClass: "atr-popover-panel",
        }),
      );
      this.ref = ref;
      const subscription = ref.afterClosed.subscribe(() => {
        if (this.ref === ref) {
          this.ref = null;
          this.opened.set(false);
        }
      });
      onCleanup(() => {
        subscription.unsubscribe();
        if (this.ref === ref) this.ref = null;
        ref.close();
      });
    });
  }
  open(): void {
    this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
  }
  toggle(): void {
    this.opened.update((value) => !value);
  }
}
