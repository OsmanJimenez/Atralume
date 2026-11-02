import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { form, FormField, required } from "@angular/forms/signals";
import { AtralumeDatePicker } from "../../index";
@Component({
  imports: [AtralumeDatePicker, ReactiveFormsModule],
  template: `<atr-date-picker label="Date" [formControl]="control" />`,
})
class ReactiveHost {
  readonly control = new FormControl<Date | null>(null, Validators.required);
}
@Component({
  imports: [AtralumeDatePicker, FormsModule],
  template: `<atr-date-picker label="Date" [(ngModel)]="value" />`,
})
class TemplateHost {
  readonly value = signal<Date | null>(null);
}
@Component({
  imports: [AtralumeDatePicker, FormField],
  template: `<atr-date-picker label="Date" [formField]="fields.value" />`,
})
class SignalHost {
  readonly state = signal<{ value: Date | null }>({ value: null });
  readonly fields = form(this.state, (path) => required(path.value));
}
describe("date-picker form interoperability", () => {
  it("supports typed Reactive Forms, user changes, dirty, touched, reset, required and disabled", async () => {
    const f = TestBed.createComponent(ReactiveHost);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector(
      "input[type=text]",
    ) as HTMLInputElement;
    const control = f.componentInstance.control;
    expect(control.invalid).toBe(true);
    input.value = "2026-11-05";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = control.value;
    expect(value).toBeInstanceOf(Date);
    expect((value as Date).getFullYear()).toBe(2026);
    expect((value as Date).getMonth()).toBe(10);
    expect((value as Date).getDate()).toBe(5);
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
      "input[type=text]",
    ) as HTMLInputElement;
    input.value = "2026-11-05";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.value();
    expect(value).toBeInstanceOf(Date);
    expect((value as Date).getFullYear()).toBe(2026);
    expect((value as Date).getMonth()).toBe(10);
    expect((value as Date).getDate()).toBe(5);
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
      "input[type=text]",
    ) as HTMLInputElement;
    input.value = "2026-11-05";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.state().value;
    expect(value).toBeInstanceOf(Date);
    expect((value as Date).getFullYear()).toBe(2026);
    expect((value as Date).getMonth()).toBe(10);
    expect((value as Date).getDate()).toBe(5);
    expect(f.componentInstance.fields.value().valid()).toBe(true);
    expect(f.componentInstance.fields.value().dirty()).toBe(true);
    f.componentInstance.state.set({ value: null });
    await f.whenStable();
    expect(f.componentInstance.fields.value().invalid()).toBe(true);
  });
});
