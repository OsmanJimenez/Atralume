import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  FormControl,
  ReactiveFormsModule,
  NgControl,
  RadioControlValueAccessor,
} from "@angular/forms";
import { AtralumeRadio } from "@atralume/angular/radio";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
@Component({
  imports: [AtralumeRadio, AtralumeControlLabel, ReactiveFormsModule],
  template:
    '<label atrControlLabel><input atrRadio type="radio" [formControl]="control" name="plan" value="personal"  /><span>Value</span></label>',
})
class Host {
  readonly control = new FormControl("", { nonNullable: true });
  indeterminate = true;
}
describe("AtralumeRadio", () => {
  it("keeps the official Angular value accessor and native semantics", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.classList.contains("atr-radio")).toBe(true);
    const ngControl = f.debugElement
      .query(By.css("input, textarea"))
      .injector.get(NgControl);
    expect(ngControl.valueAccessor instanceof RadioControlValueAccessor).toBe(
      true,
    );

    expect(input.name).toBe("plan");
    expect(input.value).toBe("personal");
    input.click();
    expect(f.componentInstance.control.value).toBe("personal");
  });
  it("updates from setValue, reset and disabled state", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    f.componentInstance.control.setValue("personal");
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
