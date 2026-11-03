import { afterNextRender, Directive, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgControl } from "@angular/forms";
import { TuiNativeValidator } from "@taiga-ui/cdk/directives/native-validator";
import { tuiInjectElement } from "@taiga-ui/cdk/utils/dom";
import {
  TuiAppearance,
  tuiAppearance,
} from "@taiga-ui/core/directives/appearance";
import { filter, fromEvent } from "rxjs";

/** Mirrors `TUI_RADIO_OPTIONS.appearance` without hosting `TuiRadioComponent`. */
function radioAppearance(el: HTMLInputElement): string {
  return el.checked ? "primary" : "outline-grayscale";
}

/**
 * Native radio with Atralume tokens and Taiga appearance primitives.
 *
 * Does not host `TuiRadioComponent`: without `NgControl` Taiga forces
 * `disabled` + `_readonly`, and the component token breaks as `hostDirectives`.
 * Styles come from `[attr.tuiRadio]`.
 *
 * Syncs `data-appearance` after ngModel writes the initial `checked` state
 * (which does not fire a native `change` on first bind).
 */
@Directive({
  selector: 'input[type="radio"][atrRadio]',
  standalone: true,
  hostDirectives: [
    {
      directive: TuiAppearance,
      inputs: ["tuiAppearanceState", "tuiAppearanceFocus", "tuiAppearanceMode"],
    },
    TuiNativeValidator,
  ],
  host: {
    class: "atr-radio",
    "[attr.tuiRadio]": '""',
  },
})
export class AtralumeRadio {
  private readonly el = tuiInjectElement<HTMLInputElement>();
  private readonly appearance = tuiAppearance(radioAppearance(this.el));
  private readonly control = inject(NgControl, { optional: true, self: true });

  constructor() {
    const sync = () => this.appearance.set(radioAppearance(this.el));
    afterNextRender(() => {
      sync();
      // ngModel assigns `checked` after the first paint — resync next macrotask.
      setTimeout(sync);
    });
    this.control?.valueChanges
      ?.pipe(takeUntilDestroyed())
      .subscribe(() => sync());
    fromEvent(this.el, "change").pipe(takeUntilDestroyed()).subscribe(sync);
    fromEvent(this.el, "click").pipe(takeUntilDestroyed()).subscribe(sync);
    // Sibling radios in the same name group update `checked` without firing
    // `change` on this element — resync when any peer changes.
    fromEvent(this.el.ownerDocument, "change", { capture: true })
      .pipe(
        takeUntilDestroyed(),
        filter((event) => {
          const target = event.target;
          return (
            target instanceof HTMLInputElement &&
            target.type === "radio" &&
            !!this.el.name &&
            target.name === this.el.name
          );
        }),
      )
      .subscribe(sync);
  }
}