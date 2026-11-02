import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AtralumeSelect, AtralumeSelectHarness } from "../../index";
@Component({
  imports: [ReactiveFormsModule, AtralumeSelect],
  template:
    '<atr-select label="People" [options]="options" [compareWith]="compare" [formControl]="control" multiple display="chips" clearable />',
})
class Host {
  readonly options = [
    { id: "ada", label: "Ada", value: { id: 1 } },
    { id: "grace", label: "Grace", value: { id: 2 } },
  ];
  readonly compare = (a: { id: number }, b: { id: number }) => a.id === b.id;
  readonly control = new FormControl<readonly { id: number }[] | null>([
    { id: 1 },
  ]);
}
describe("Select harness and object-valued multiple forms", () => {
  it("selects through the overlay, removes a chip and clears the form value", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const select = await TestbedHarnessEnvironment.loader(f).getHarness(
      AtralumeSelectHarness,
    );
    await select.open();
    expect(await select.isMultiple()).toBe(true);
    expect(await (await select.getOptions())[0].isSelected()).toBe(true);
    await select.selectOption("Grace");
    expect(f.componentInstance.control.value).toEqual([{ id: 1 }, { id: 2 }]);
    await select.close();
    const remove = f.nativeElement.querySelector(
      'button[aria-label="Remove Ada"]',
    ) as HTMLButtonElement;
    expect(remove).not.toBeNull();
    remove.click();
    await f.whenStable();
    expect(f.componentInstance.control.value).toEqual([{ id: 2 }]);
    await select.clear();
    expect(f.componentInstance.control.value).toEqual([]);
  });
});
