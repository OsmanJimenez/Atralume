import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  FormControl,
  ReactiveFormsModule,
  NgControl,
  DefaultValueAccessor,
} from "@angular/forms";
import { AtralumeTextarea } from "@atralume/angular/textarea";
import { AtralumeControlLabel } from "@atralume/angular/form-field";
@Component({
  imports: [AtralumeTextarea, AtralumeControlLabel, ReactiveFormsModule],
  template:
    '<label atrControlLabel><textarea atrTextarea  [formControl]="control" resize="none"></textarea><span>Value</span></label>',
})
class Host {
  readonly control = new FormControl("", { nonNullable: true });
  indeterminate = true;
}
describe("AtralumeTextarea", () => {
  it("keeps the official Angular value accessor and native semantics", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("textarea") as HTMLInputElement;
    expect(input.classList.contains("atr-textarea")).toBe(true);
    const ngControl = f.debugElement
      .query(By.css("input, textarea"))
      .injector.get(NgControl);
    expect(ngControl.valueAccessor instanceof DefaultValueAccessor).toBe(true);

    input.value = "Hello";
    input.dispatchEvent(new Event("input"));
    expect(f.componentInstance.control.value).toBe("Hello");
    input.dispatchEvent(new Event("blur"));
    expect(f.componentInstance.control.touched).toBe(true);
  });
  it("updates from setValue, reset and disabled state", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("textarea") as HTMLInputElement;
    f.componentInstance.control.setValue("Updated");
    await f.whenStable();
    expect(input.value).toBe("Updated");
    f.componentInstance.control.disable();
    await f.whenStable();
    expect(input.disabled).toBe(true);
    f.componentInstance.control.enable();
    f.componentInstance.control.reset();
    await f.whenStable();
    expect(input.value).toBe("");
  });
});
