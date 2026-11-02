import {
  Directive,
  DoCheck,
  ElementRef,
  Injectable,
  InjectionToken,
  Signal,
  inject,
  signal,
} from "@angular/core";

/** @internal Application-scoped counters are isolated between SSR requests. */
@Injectable({ providedIn: "root" })
export class AtralumeControlIds {
  private next = 0;
  create(): string {
    return "atr-control-" + this.next++;
  }
}
/** @internal Shared across secondary entrypoints; not a consumer extension API. */
export interface AtralumeFormFieldControl {
  readonly controlId: Signal<string>;
  readonly disabled: Signal<boolean>;
  readonly readonly: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  readonly focused: Signal<boolean>;
  setDescribedByIds(ids: readonly string[]): void;
}
/** @internal */
export const ATR_FORM_FIELD_CONTROL =
  new InjectionToken<AtralumeFormFieldControl>("AtralumeFormFieldControl");

/** @internal Reads native state; Angular keeps ownership of its value accessor. */
@Directive({
  host: { "(focus)": "focused.set(true)", "(blur)": "focused.set(false)" },
})
export abstract class AtralumeNativeTextControl
  implements AtralumeFormFieldControl, DoCheck
{
  protected readonly element =
    inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef)
      .nativeElement;
  readonly controlId = signal(
    this.element.id || inject(AtralumeControlIds).create(),
  );
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly invalid = signal(false);
  readonly focused = signal(false);
  private describedBy: readonly string[] = [];
  constructor() {
    if (!this.element.id) this.element.id = this.controlId();
  }
  ngDoCheck(): void {
    this.controlId.set(this.element.id);
    this.disabled.set(this.element.disabled);
    this.readonly.set(this.element.readOnly);
    this.invalid.set(
      this.element.getAttribute("aria-invalid") === "true" ||
        (this.element.classList.contains("ng-invalid") &&
          (this.element.classList.contains("ng-touched") ||
            this.element.classList.contains("ng-dirty"))),
    );
  }
  setDescribedByIds(ids: readonly string[]): void {
    const existing = (this.element.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && !this.describedBy.includes(id));
    this.describedBy = ids;
    const merged = [...new Set([...existing, ...ids])].join(" ");
    if (merged) this.element.setAttribute("aria-describedby", merged);
    else this.element.removeAttribute("aria-describedby");
  }
}
