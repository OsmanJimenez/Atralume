import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeCheckbox, AtralumeCheckboxHarness } from "../../index";

@Component({
  imports: [AtralumeCheckbox],
  template:
    '<label><input atrCheckbox type="checkbox" [indeterminate]="indeterminate" /><span>Accept terms</span></label>',
})
class Host {
  indeterminate = true;
}

describe("AtralumeCheckboxHarness", () => {
  it("observes native state and changes only enabled checkboxes", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      AtralumeCheckboxHarness,
    );

    expect(await harness.isChecked()).toBe(false);
    expect(await harness.isIndeterminate()).toBe(true);
    await harness.check();
    expect(await harness.isChecked()).toBe(true);

    const input = fixture.nativeElement.querySelector(
      "input",
    ) as HTMLInputElement;
    input.disabled = true;
    expect(await harness.isDisabled()).toBe(true);
    await harness.uncheck();
    expect(await harness.isChecked()).toBe(true);
  });
});
