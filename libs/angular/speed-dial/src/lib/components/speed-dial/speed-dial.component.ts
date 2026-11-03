import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  computed,
  booleanAttribute,
  inject,
  ElementRef,
  contentChildren,
  viewChild,
  PLATFORM_ID,
} from "@angular/core";
import {
  afterNextRender,
  Injector,
  Renderer2,
  DestroyRef,
} from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { AtralumeFab } from "@atralume/angular/fab";
import { AtralumeSpeedDialAction } from "../../directives/speed-dial-action.directive";

/**
 * Composition over Taiga-backed `AtralumeFab`. No Taiga speed-dial primitive.
 */
@Component({
  selector: "atr-speed-dial",
  standalone: true,
  templateUrl: "./speed-dial.component.html",
  styleUrl: "./speed-dial.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AtralumeFab],
  host: {
    class: "atr-speed-dial",
    "[attr.data-orientation]": "orientation()",
    "(keydown)": "onKey($event)",
    "(click)": "clicked($event)",
    "(focusout)": "lostFocus($event)",
  },
})
export class AtralumeSpeedDial {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<"vertical" | "horizontal">("vertical");
  protected readonly visible = computed(
    () => this.opened() && !this.disabled(),
  );
  private readonly actions = contentChildren(AtralumeSpeedDialAction);
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly trigger =
    viewChild.required<ElementRef<HTMLButtonElement>>("trigger");
  private readonly injector = inject(Injector);
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const unlisten = inject(Renderer2).listen(
        inject(DOCUMENT),
        "pointerdown",
        (event: PointerEvent) => {
          if (this.visible() && !this.element.contains(event.target as Node))
            this.dismiss(false);
        },
      );
      inject(DestroyRef).onDestroy(unlisten);
    }
  }
  protected toggle(): void {
    if (!this.disabled()) this.opened.update((value) => !value);
  }
  dismiss(restore = true): void {
    this.opened.set(false);
    if (restore) this.trigger().nativeElement.focus();
  }
  protected clicked(event: Event): void {
    if ((event.target as HTMLElement).closest(".atr-speed-dial-action"))
      this.dismiss();
  }
  protected lostFocus(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      !this.element.contains(event.relatedTarget as Node)
    )
      this.opened.set(false);
  }
  protected onKey(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === "Escape" && this.visible()) {
      event.preventDefault();
      event.stopPropagation();
      this.dismiss();
      return;
    }
    const actions = this.actions().filter((action) => !action.isDisabled());
    if (!actions.length) return;
    const vertical = this.orientation() === "vertical",
      rtl = this.element.matches(":dir(rtl)");
    const forward = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight",
      backward = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    let index = actions.findIndex(
      (action) => action.element() === event.target,
    );
    if (![forward, backward, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? actions.length - 1
          : event.key === forward
            ? (index + 1) % actions.length
            : index < 0
              ? actions.length - 1
              : (index - 1 + actions.length) % actions.length;
    this.opened.set(true);
    afterNextRender(() => actions[index]?.focus(), { injector: this.injector });
  }
}
