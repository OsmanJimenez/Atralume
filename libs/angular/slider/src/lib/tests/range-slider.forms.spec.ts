import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { form, FormField, required } from "@angular/forms/signals";
import { AtralumeRangeSlider, type AtralumeSliderRange } from "../../index";
@Component({
  imports: [AtralumeRangeSlider, ReactiveFormsModule],
  template: `<atr-range-slider label="Range" [formControl]="control" />`,
})
class ReactiveHost {
  readonly control = new FormControl<AtralumeSliderRange | null>(
    null,
    Validators.required,
  );
}
@Component({
  imports: [AtralumeRangeSlider, FormsModule],
  template: `<atr-range-slider label="Range" [(ngModel)]="value" />`,
})
class TemplateHost {
  readonly value = signal<AtralumeSliderRange | null>(null);
}
@Component({
  imports: [AtralumeRangeSlider, FormField],
  template: `<atr-range-slider label="Range" [formField]="fields.value" />`,
})
class SignalHost {
  readonly state = signal<{ value: AtralumeSliderRange | null }>({
    value: null,
  });
  readonly fields = form(this.state, (path) => required(path.value));
}
describe("slider form interoperability", () => {
  it("supports typed Reactive Forms, user changes, dirty, touched, reset, required and disabled", async () => {
    const f = TestBed.createComponent(ReactiveHost);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector(
      "input[type=range]",
    ) as HTMLInputElement;
    const control = f.componentInstance.control;
    expect(control.invalid).toBe(true);
    input.value = "20";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = control.value;
    expect(value).toEqual({ start: 20, end: 100 });
    expect(control.dirty).toBe(true);
    expect(control.valid).toBe(true);
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await f.whenStable();
    expect(control.touched).toBe(true);
    control.reset();
    await f.whenStable();
    expect(control.value).toBeNull();
    control.disable();
    await f.whenStable();
    expect(input.disabled).toBe(true);
  });
  it("supports template-driven values and external null reset in a zoneless host", async () => {
    const f = TestBed.createComponent(TemplateHost);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector(
      "input[type=range]",
    ) as HTMLInputElement;
    input.value = "20";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.value();
    expect(value).toEqual({ start: 20, end: 100 });
    f.componentInstance.value.set(null);
    await f.whenStable();
    expect(f.componentInstance.value()).toBeNull();
  });
  it("supports Signal Forms values, required and user-driven dirty state", async () => {
    const f = TestBed.createComponent(SignalHost);
    f.autoDetectChanges();
    await f.whenStable();
    expect(f.componentInstance.fields.value().invalid()).toBe(true);
    const input = f.nativeElement.querySelector(
      "input[type=range]",
    ) as HTMLInputElement;
    input.value = "20";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.state().value;
    expect(value).toEqual({ start: 20, end: 100 });
    expect(f.componentInstance.fields.value().valid()).toBe(true);
    expect(f.componentInstance.fields.value().dirty()).toBe(true);
    f.componentInstance.state.set({ value: null });
    await f.whenStable();
    expect(f.componentInstance.fields.value().invalid()).toBe(true);
  });
});
