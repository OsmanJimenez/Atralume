import { TestBed } from "@angular/core/testing";
import { AtralumeTimePicker } from "../../index";
describe("Time Picker value contract", () => {
  it("uses a time object, enforces step and clamps neither dates nor invalid hours silently", async () => {
    const f = TestBed.createComponent(AtralumeTimePicker);
    f.componentRef.setInput("label", "Time");
    f.componentRef.setInput("step", 900);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "14:17";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.validate()).toEqual({ timeParse: true });
    input.value = "14:30";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.value()).toEqual({ hours: 14, minutes: 30 });
    expect(f.componentInstance.validate()).toBeNull();
  });
});
