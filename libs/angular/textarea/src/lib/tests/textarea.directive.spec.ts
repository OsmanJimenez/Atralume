import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TuiTextfield } from "@atralume/angular/form-field";
import { AtralumeTextarea, AtralumeTextareaHarness } from "../../index";

@Component({
  imports: [AtralumeTextarea, TuiTextfield],
  template: `
    <tui-textfield tuiTextfieldSize="m">
      <label tuiLabel>Message</label>
      <textarea
        atrTextarea
        rows="3"
        [readonly]="readonly"
        resize="none"
      ></textarea>
    </tui-textfield>
  `,
})
class Host {
  readonly = false;
}

describe("AtralumeTextareaHarness", () => {
  it("edits native values and reports disabled and readonly state", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      AtralumeTextareaHarness,
    );

    await harness.setValue("Atralume controls");
    expect(await harness.getValue()).toBe("Atralume controls");
    expect(await harness.isReadonly()).toBe(false);
    expect(await harness.isDisabled()).toBe(false);
    const textarea = fixture.nativeElement.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    expect(textarea.style.resize).toBe("none");
  });

  it("preserves native readonly state", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.readonly = true;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      AtralumeTextareaHarness,
    );

    expect(await harness.isReadonly()).toBe(true);
  });
});
