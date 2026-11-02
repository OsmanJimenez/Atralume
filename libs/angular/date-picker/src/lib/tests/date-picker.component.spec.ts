import { TestBed } from "@angular/core/testing";
import { AtralumeDatePicker } from "../../index";
import { AtralumeNativeDateAdapter } from "@atralume/angular/calendar";
describe("Date Picker parsing and range values", () => {
  it("reports invalid manual dates and commits typed ranges through Calendar", async () => {
    const f = TestBed.createComponent(AtralumeDatePicker<Date>);
    f.componentRef.setInput("label", "Date");
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "2026-02-30";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.validate()).toEqual({ dateParse: true });
    expect(f.componentInstance.value()).toBeNull();
    f.componentRef.setInput("selectionMode", "range");
    f.componentRef.setInput(
      "min",
      new AtralumeNativeDateAdapter().create(2026, 0, 1),
    );
    await f.whenStable();
    input.value = "2026-11-05 — 2026-11-08";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.validate()).toBeNull();
    expect(f.componentInstance.rangeValue()?.end?.getDate()).toBe(8);
  });
});
