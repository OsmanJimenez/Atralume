import {
  afterNextRender,
  Directive,
  booleanAttribute,
  effect,
  inject,
  input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgControl } from "@angular/forms";
import { tuiInjectElement } from "@taiga-ui/cdk/utils/dom";
import {
  TuiAppearance,
  tuiAppearance,
} from "@taiga-ui/core/directives/appearance";
import {
  TuiIcons,
  tuiIconEnd,
  tuiIconStart,
} from "@taiga-ui/core/directives/icons";
import { fromEvent } from "rxjs";

/** Mirrors `TUI_CHECKBOX_OPTIONS.appearance` without hosting `TuiCheckbox`. */
function checkboxAppearance(el: HTMLInputElement): string {
  return el.checked || el.indeterminate ? "primary" : "outline-grayscale";
}

/**
 * Native checkbox with Atralume tokens and Taiga appearance/icon primitives.
 *
 * Does not host `TuiCheckbox`: that attribute component disables the host when
 * no `NgControl` is present (`disabled: !control`), and using it as
 * `hostDirectives` fails at runtime. Styles come from `[attr.tuiCheckbox]`.
 *
 * Syncs `data-appearance` (primary ↔ outline-grayscale) and Taiga icons so the
 * control does not render as a dead black square.
 */
@Directive({
  selector: 'input[type="checkbox"][atrCheckbox]',
  standalone: true,
  hostDirectives: [
    {
      directive: TuiAppearance,
      inputs: ["tuiAppearanceState", "tuiAppearanceFocus", "tuiAppearanceMode"],
    },
    TuiIcons,
  ],
  host: {
    class: "atr-checkbox",
    "[attr.tuiCheckbox]": '""',
    "[indeterminate]": "indeterminate()",
  },
})
export class AtralumeCheckbox {
  readonly indeterminate = input(false, { transform: booleanAttribute });

  private readonly el = tuiInjectElement<HTMLInputElement>();
  private readonly appearance = tuiAppearance(checkboxAppearance(this.el));
  private readonly control = inject(NgControl, { optional: true, self: true });

  /** Check / indeterminate glyphs used by `[tuiCheckbox]::before` masks. */
  private readonly checkIcon = tuiIconStart("@tui.check");
  private readonly indeterminateIcon = tuiIconEnd("@tui.minus");

  constructor() {
    const sync = () => this.appearance.set(checkboxAppearance(this.el));
    afterNextRender(() => {
      sync();
      setTimeout(sync);
    });
    this.control?.valueChanges
      ?.pipe(takeUntilDestroyed())
      .subscribe(() => sync());
    fromEvent(this.el, "change").pipe(takeUntilDestroyed()).subscribe(sync);
    fromEvent(this.el, "click").pipe(takeUntilDestroyed()).subscribe(sync);
    effect(() => {
      this.indeterminate();
      queueMicrotask(sync);
    });
  }
}