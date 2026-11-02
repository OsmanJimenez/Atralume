import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { form, FormField, required } from "@angular/forms/signals";
import { AtralumeFileUpload } from "../../index";
@Component({
  imports: [AtralumeFileUpload, ReactiveFormsModule],
  template: `<atr-file-upload label="Files" [formControl]="control" />`,
})
class ReactiveHost {
  readonly control = new FormControl<readonly File[] | null>(
    null,
    Validators.required,
  );
}
@Component({
  imports: [AtralumeFileUpload, FormsModule],
  template: `<atr-file-upload label="Files" [(ngModel)]="value" />`,
})
class TemplateHost {
  readonly value = signal<readonly File[] | null>(null);
}
@Component({
  imports: [AtralumeFileUpload, FormField],
  template: `<atr-file-upload label="Files" [formField]="fields.value" />`,
})
class SignalHost {
  readonly state = signal<{ value: readonly File[] | null }>({ value: null });
  readonly fields = form(this.state, (path) => required(path.value));
}
describe("file-upload form interoperability", () => {
  it("supports typed Reactive Forms, user changes, dirty, touched, reset, required and disabled", async () => {
    const f = TestBed.createComponent(ReactiveHost);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;
    const control = f.componentInstance.control;
    expect(control.invalid).toBe(true);
    const file = new File(["abc"], "note.txt", { type: "text/plain" });
    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await f.whenStable();
    const value = control.value;
    expect((value as readonly File[])[0].name).toBe("note.txt");
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
      "input[type=file]",
    ) as HTMLInputElement;
    const file = new File(["abc"], "note.txt", { type: "text/plain" });
    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.value();
    expect((value as readonly File[])[0].name).toBe("note.txt");
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
      "input[type=file]",
    ) as HTMLInputElement;
    const file = new File(["abc"], "note.txt", { type: "text/plain" });
    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await f.whenStable();
    const value = f.componentInstance.state().value;
    expect((value as readonly File[])[0].name).toBe("note.txt");
    expect(f.componentInstance.fields.value().valid()).toBe(true);
    expect(f.componentInstance.fields.value().dirty()).toBe(true);
    f.componentInstance.state.set({ value: null });
    await f.whenStable();
    expect(f.componentInstance.fields.value().invalid()).toBe(true);
  });
});
