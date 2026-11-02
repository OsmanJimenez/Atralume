import { TestBed } from "@angular/core/testing";
import { AtralumeProgressBar } from "../../index";
describe("AtralumeProgressBar", () => {
  it("omits value for indeterminate and normalizes determinate ARIA", async () => {
    const f = TestBed.createComponent(AtralumeProgressBar);
    f.componentRef.setInput("label", "Upload");
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.getAttribute("role")).toBe("progressbar");
    expect(e.getAttribute("aria-label")).toBe("Upload");
    expect(e.hasAttribute("aria-valuenow")).toBe(false);
    f.componentRef.setInput("min", 20);
    f.componentRef.setInput("max", 80);
    f.componentRef.setInput("value", 50);
    f.detectChanges();
    await f.whenStable();
    expect(e.getAttribute("aria-valuemin")).toBe("20");
    expect(e.getAttribute("aria-valuemax")).toBe("80");
    expect(e.getAttribute("aria-valuenow")).toBe("50");
  });
  it("clamps out-of-range values and reports developer mistakes", async () => {
    const warning = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    try {
      const f = TestBed.createComponent(AtralumeProgressBar);
      f.componentRef.setInput("label", "Upload");
      f.componentRef.setInput("value", 200);
      f.detectChanges();
      await f.whenStable();
      expect(f.nativeElement.getAttribute("aria-valuenow")).toBe("100");
      expect(warning).toHaveBeenCalled();
    } finally {
      warning.mockRestore();
    }
  });
  it("rejects invalid range", () => {
    const f = TestBed.createComponent(AtralumeProgressBar);
    f.componentRef.setInput("label", "Upload");
    f.componentRef.setInput("min", 100);
    expect(() => f.detectChanges()).toThrow(/min < max/);
  });
  it("requires meaningful accessible name", () => {
    const f = TestBed.createComponent(AtralumeProgressBar);
    f.componentRef.setInput("label", " ");
    expect(() => f.detectChanges()).toThrow(/accessible label/);
  });
});
