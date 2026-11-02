import {
  Directive,
  ElementRef,
  Injector,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  type DoCheck,
} from "@angular/core";
import { NgControl, type ControlValueAccessor } from "@angular/forms";
import type { FormValueControl } from "@angular/forms/signals";
import { ɵAtralumeControlIds as AtralumeControlIds } from "@atralume/angular";
/** @internal Common value bridge. User commits and external writes have distinct paths. */
@Directive({
  host: { "(focusin)": "focused.set(true)", "(focusout)": "blur($event)" },
})
export abstract class AtralumeValueControl<T>
  implements ControlValueAccessor, FormValueControl<T | null>, DoCheck
{
  readonly value = model<T | null>(null);
  readonly label = input.required<string>();
  readonly controlId = input<string>(inject(AtralumeControlIds).create());
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly touch = output<void>();
  readonly focused = signal(false);
  readonly descriptions = signal<readonly string[]>([]);
  private readonly formDisabled = signal(false);
  private readonly formInvalid = signal(false);
  readonly blocked = computed(() => this.disabled() || this.formDisabled());
  readonly displayInvalid = computed(
    () => this.invalid() || this.formInvalid() || !!this.error(),
  );
  protected readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly controlInjector = inject(Injector);
  private change: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: T | null) => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  ngDoCheck(): void {
    const control = this.controlInjector.get(NgControl, null, {
      self: true,
    })?.control;
    this.formInvalid.set(
      !!control?.invalid && (!!control?.touched || !!control?.dirty),
    );
  }
  commit(value: T | null): void {
    if (this.blocked() || this.readonly()) return;
    this.value.set(value);
    this.change(value);
  }
  markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }
  protected blur(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      this.element.contains(event.relatedTarget as Node)
    )
      return;
    this.focused.set(false);
    this.markTouched();
  }
  focus(options?: FocusOptions): void {
    this.element
      .querySelector<HTMLElement>("[data-atr-value-control]")
      ?.focus(options);
  }
  setDescribedByIds(ids: readonly string[]): void {
    this.descriptions.set(ids);
  }
}
