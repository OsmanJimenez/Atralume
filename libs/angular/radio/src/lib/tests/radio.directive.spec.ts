import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeRadio, AtralumeRadioHarness } from "../../index";

@Component({
  imports: [AtralumeRadio],
  template:
    '<fieldset><legend>Plan</legend><label><input atrRadio type="radio" name="plan" value="personal" /><span>Personal</span></label><label><input atrRadio type="radio" name="plan" value="business" /><span>Business</span></label></fieldset>',
})
class Host {}

describe("AtralumeRadioHarness", () => {
  it("observes native grouping, selection and disabled state", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const radios = await loader.getAllHarnesses(AtralumeRadioHarness);

    expect(radios).toHaveLength(2);
    expect(await radios[0].getName()).toBe("plan");
    expect(await radios[0].getValue()).toBe("personal");
    await radios[0].check();
    expect(await radios[0].isChecked()).toBe(true);
    await radios[1].check();
    expect(await radios[0].isChecked()).toBe(false);
    expect(await radios[1].isChecked()).toBe(true);

    const business = fixture.nativeElement.querySelectorAll(
      "input",
    )[1] as HTMLInputElement;
    business.disabled = true;
    expect(await radios[1].isDisabled()).toBe(true);
  });
});
