import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput, AtralumeInputHarness } from "../../index";

@Component({
  imports: [AtralumeInput, TuiTextfield],
  template: `
    <tui-textfield tuiTextfieldSize="m">
      <label tuiLabel for="input-email">Email</label>
      <input atrInput id="input-email" type="email" [readonly]="readonly" />
    </tui-textfield>
  `,
})
class Host {
  readonly = false;
}

describe("AtralumeInputHarness", () => {
  it("reads and edits native input values", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        AtralumeInputHarness,
      );

    await harness.setValue("alex@example.com");
    expect(await harness.getValue()).toBe("alex@example.com");
    expect(await harness.isDisabled()).toBe(false);
    expect(await harness.isReadonly()).toBe(false);
  });

  it("reports native readonly state", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.readonly = true;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        AtralumeInputHarness,
      );

    expect(await harness.isReadonly()).toBe(true);
  });
});
