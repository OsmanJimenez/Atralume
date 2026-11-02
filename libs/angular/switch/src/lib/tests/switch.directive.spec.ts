import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeSwitch, AtralumeSwitchHarness } from "../../index";

@Component({
  imports: [AtralumeSwitch],
  template:
    '<label><input atrSwitch type="checkbox" /><span>Enable notifications</span></label>',
})
class Host {}

describe("AtralumeSwitchHarness", () => {
  it("uses the native checkbox state with switch semantics", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      AtralumeSwitchHarness,
    );
    const input = fixture.nativeElement.querySelector("input");

    expect(input.getAttribute("role")).toBe("switch");
    expect(await harness.isChecked()).toBe(false);
    await harness.check();
    expect(await harness.isChecked()).toBe(true);

    input.disabled = true;
    expect(await harness.isDisabled()).toBe(true);
  });
});
