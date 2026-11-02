import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  FormControl,
  ReactiveFormsModule,
  NgControl,
  CheckboxControlValueAccessor,
} from "@angular/forms";
import { AtralumeCheckbox } from "@atralume/angular/checkbox";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
@Component({
  imports: [AtralumeCheckbox, AtralumeControlLabel, ReactiveFormsModule],
  template:
    '<label atrControlLabel><input atrCheckbox type="checkbox" [formControl]="control"  [indeterminate]="indeterminate" /><span>Value</span></label>',
})
class Host {
  readonly control = new FormControl(false, { nonNullable: true });
  indeterminate = true;
}
describe("AtralumeCheckbox", () => {
  it("keeps the official Angular value accessor and native semantics", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.classList.contains("atr-checkbox")).toBe(true);
    const ngControl = f.debugElement
      .query(By.css("input, textarea"))
      .injector.get(NgControl);
    expect(
      ngControl.valueAccessor instanceof CheckboxControlValueAccessor,
    ).toBe(true);

    expect(input.indeterminate).toBe(true);

    input.click();
    expect(f.componentInstance.control.value).toBe(true);
  });
  it("updates from setValue, reset and disabled state", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    f.componentInstance.control.setValue(true);
    await f.whenStable();
    expect(input.checked).toBe(true);
    f.componentInstance.control.disable();
    await f.whenStable();
    expect(input.disabled).toBe(true);
    f.componentInstance.control.enable();
    f.componentInstance.control.reset();
    await f.whenStable();
    expect(input.checked).toBe(false);
  });
});
