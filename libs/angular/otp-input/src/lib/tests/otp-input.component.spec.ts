import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AtralumeOtpInput } from "../../index";

@Component({
  imports: [AtralumeOtpInput, ReactiveFormsModule],
  template: `<atr-otp-input label="One-time code" [formControl]="control" [length]="4" />`,
})
class Host {
  readonly control = new FormControl<string | null>(null);
}

describe("OtpInput", () => {
  it("renders with a label and hosts tuiInputPin", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const host = f.nativeElement as HTMLElement;
    expect(host.querySelector("atr-otp-input")).toBeTruthy();
    expect(host.querySelector("input[tuiInputPin]")).toBeTruthy();
    expect(host.textContent).toContain("One-time code");
  });

  it("syncs Reactive Forms string values", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    f.componentInstance.control.setValue("1234");
    await f.whenStable();
    const input = f.nativeElement.querySelector(
      "input[tuiInputPin]",
    ) as HTMLInputElement;
    expect(input.value).toBe("1234");
    expect(f.componentInstance.control.value).toBe("1234");
  });
});
