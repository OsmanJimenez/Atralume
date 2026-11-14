import { provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeFormFieldHarness } from "@osmanjimenez/atralume/form-field";
import { AtralumeInputHarness } from "@osmanjimenez/atralume/input";
import { AtralumeTextareaHarness } from "@osmanjimenez/atralume/textarea";
import { AtralumeCheckboxHarness } from "@osmanjimenez/atralume/checkbox";
import { AtralumeRadioHarness } from "@osmanjimenez/atralume/radio";
import { AtralumeSwitchHarness } from "@osmanjimenez/atralume/switch";
import { FormsDemo } from "./forms-demo.component";

describe("Public form harnesses in zoneless mode", () => {
  it("interacts with all native controls using stable public selectors", async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(FormsDemo);
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const field = await loader.getHarness(AtralumeFormFieldHarness);
    expect(await field.getLabel()).toContain("Email");
    expect(await field.getHint()).toContain("stays in this demo");
    expect(await field.getAppearance()).toBe("outline");
    expect(await field.isRequired()).toBe(true);
    const input = await loader.getHarness(AtralumeInputHarness);
    await input.setValue("harness@example.com");
    expect(fixture.componentInstance.form.controls.email.value).toBe(
      "harness@example.com",
    );
    await input.focus();
    await input.blur();
    const textarea = await loader.getHarness(AtralumeTextareaHarness);
    await textarea.setValue("Notes");
    expect(await textarea.getValue()).toBe("Notes");
    const checkbox = await loader.getHarness(AtralumeCheckboxHarness);
    await checkbox.check();
    expect(await checkbox.isChecked()).toBe(true);
    await checkbox.uncheck();
    expect(await checkbox.isChecked()).toBe(false);
    const radios = await loader.getAllHarnesses(AtralumeRadioHarness);
    await radios[1].check();
    expect(fixture.componentInstance.form.controls.plan.value).toBe("business");
    const toggle = await loader.getHarness(AtralumeSwitchHarness);
    await toggle.toggle();
    expect(fixture.componentInstance.form.controls.notifications.value).toBe(
      false,
    );
    fixture.componentInstance.form.disable();
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(await input.isDisabled()).toBe(true);
    expect(await toggle.isDisabled()).toBe(true);
  });
});
