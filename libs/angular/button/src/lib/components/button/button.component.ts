import { AtralumeProgressSpinner } from "@atralume/angular/progress";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewEncapsulation,
} from "@angular/core";
import { TuiButton } from "@taiga-ui/core";

export type ButtonAppearance = "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "small" | "medium" | "large";

/**
 * Public Atralume button adapter over Taiga UI `TuiButton`.
 * Keeps Atralume selectors, appearances, sizes, loading, and tokens.
 */
@Component({
  selector: "button[atrButton], a[atrButton]",
  standalone: true,
  imports: [AtralumeProgressSpinner],
  // Alias Taiga size away so Atralume `size` remains the public contract.
  hostDirectives: [{ directive: TuiButton, inputs: ["size: tuiSize"] }],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "atr-button",
    "[attr.tuiButton]": '""',
    "[attr.data-appearance]": "appearance()",
    "[attr.data-size]": "size()",
    "[class.atr-button--full]": "fullWidth()",
    "[class.atr-button--loading]": "loading()",
    "[attr.disabled]": "nativeButton && blocked() ? '' : null",
    "[attr.aria-disabled]": 'blocked() ? "true" : null',
    "[attr.aria-busy]": 'loading() ? "true" : null',
    "[attr.tabindex]": "blocked() ? -1 : tabindex()",
  },
})
export class AtralumeButton {
  readonly appearance = input<ButtonAppearance>("filled");
  readonly size = input<ButtonSize>("medium");
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly tabindex = input<string | number | null>(null);

  protected readonly nativeButton =
    inject<ElementRef<HTMLElement>>(
      ElementRef,
    ).nativeElement.tagName.toLowerCase() === "button";

  protected readonly blocked = computed(
    () => this.disabled() || this.loading(),
  );

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const unlisten = inject(Renderer2).listen(
      element,
      "click",
      (event: Event) => {
        if (this.blocked()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    inject(DestroyRef).onDestroy(unlisten);
  }
}
