import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { form, FormField, required, min, max } from "@angular/forms/signals";
import { AtralumeSlider } from "../../index";
@Component({
  imports: [AtralumeSlider, ReactiveFormsModule],
  template: `<atr-slider
    label="Amount"
    [min]="0"
    [max]="1"
    [step]="0.1"
    [formControl]="control"
  />`,
})
class ReactiveHost {
  readonly control = new FormControl<number | null>(null, Validators.required);
}
@Component({
  imports: [AtralumeSlider, FormsModule],
  template: `<atr-slider
    label="Amount"
    [min]="0"
    [max]="1"
    [step]="0.1"
    [(ngModel)]="value"
  />`,
})
class TemplateHost {
  readonly value = signal<number | null>(null);
}
@Component({
  imports: [AtralumeSlider, FormField],
  template: `<atr-slider
    label="Amount"
    [step]="0.1"
    [formField]="fields.value"
  />`,
})
class SignalHost {
  readonly state = signal<{ value: number | null }>({ value: null });
  readonly fields = form(this.state, (path) => {
    required(path.value);
    min(path.value, 0);
    max(path.value, 1);
  });
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
    input.value = "0.3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = control.value;
    expect(value).toBe(0.3);
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
    input.value = "0.3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.value();
    expect(value).toBe(0.3);
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
    input.value = "0.3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.state().value;
    expect(value).toBe(0.3);
    expect(f.componentInstance.fields.value().valid()).toBe(true);
    expect(f.componentInstance.fields.value().dirty()).toBe(true);
    f.componentInstance.state.set({ value: null });
    await f.whenStable();
    expect(f.componentInstance.fields.value().invalid()).toBe(true);
  });
});
