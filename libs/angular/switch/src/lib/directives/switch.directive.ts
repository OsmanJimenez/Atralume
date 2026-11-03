import { afterNextRender, Directive, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgControl } from "@angular/forms";
import { tuiInjectElement } from "@taiga-ui/cdk/utils/dom";
import {
  TuiAppearance,
  tuiAppearance,
} from "@taiga-ui/core/directives/appearance";
import { TuiIcons, tuiIconStart } from "@taiga-ui/core/directives/icons";
import { fromEvent } from "rxjs";

/** Mirrors `TUI_SWITCH_OPTIONS.appearance` without hosting `TuiSwitch`. */
function switchAppearance(el: HTMLInputElement): string {
  return el.checked ? "primary" : "secondary";
}

/**
 * Native switch (checkbox + role) with Atralume tokens and Taiga primitives.
 *
 * Does not host `TuiSwitch`: without `NgControl` Taiga forces `disabled`, and
 * the component token breaks as `hostDirectives`. Styles come from
 * `[attr.tuiSwitch]`.
 */
@Directive({
  selector: 'input[type="checkbox"][atrSwitch]',
  standalone: true,
  hostDirectives: [
    {
      directive: TuiAppearance,
      inputs: ["tuiAppearanceState", "tuiAppearanceFocus", "tuiAppearanceMode"],
    },
    TuiIcons,
  ],
  host: {
    class: "atr-switch",
    role: "switch",
    "[attr.tuiSwitch]": '""',
  },
})
export class AtralumeSwitch {
  private readonly el = tuiInjectElement<HTMLInputElement>();
  private readonly appearance = tuiAppearance(switchAppearance(this.el));
  private readonly checkIcon = tuiIconStart("@tui.check");
  private readonly control = inject(NgControl, { optional: true, self: true });

  constructor() {
    const sync = () => this.appearance.set(switchAppearance(this.el));
    afterNextRender(() => {
      sync();
      setTimeout(sync);
    });
    this.control?.valueChanges
      ?.pipe(takeUntilDestroyed())
      .subscribe(() => sync());
    fromEvent(this.el, "change").pipe(takeUntilDestroyed()).subscribe(sync);
    fromEvent(this.el, "click").pipe(takeUntilDestroyed()).subscribe(sync);
  }
}