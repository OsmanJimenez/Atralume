import { TestBed } from "@angular/core/testing";
import { AtralumeRangeSlider } from "../../index";
describe("Range Slider bounds and precision", () => {
  it("does not cross thumbs and exposes their differentiated bounds and labels", async () => {
    const f = TestBed.createComponent(AtralumeRangeSlider);
    f.componentRef.setInput("label", "Budget");
    f.componentInstance.writeValue({ start: 20, end: 40 });
    f.autoDetectChanges();
    await f.whenStable();
    const inputs = f.nativeElement.querySelectorAll(
      "input",
    ) as NodeListOf<HTMLInputElement>;
    inputs[0].value = "60";
    inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.value()).toEqual({ start: 40, end: 40 });
    expect(inputs[0].getAttribute("aria-label")).toBe("Budget start");
    expect(inputs[1].getAttribute("aria-label")).toBe("Budget end");
    expect(inputs[0].getAttribute("aria-valuemax")).toBe("40");
    f.componentRef.setInput("minimum", 0);
    f.componentRef.setInput("maximum", 1);
    f.componentRef.setInput("step", 0.1);
    await f.whenStable();
    expect(f.componentInstance.normalize(0.1 + 0.2)).toBe(0.3);
  });
});
