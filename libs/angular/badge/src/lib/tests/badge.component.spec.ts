import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeBadge } from "../../index";
@Component({
  imports: [AtralumeBadge],
  template:
    '<atr-badge tone="success" appearance="outlined" size="small"><span>✓</span>Active</atr-badge>',
})
class Host {}
describe("AtralumeBadge", () => {
  it("projects status and icons without interactive role", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement.querySelector("atr-badge") as HTMLElement;
    expect(e.textContent).toContain("Active");
    expect(e.querySelector("span")).not.toBeNull();
    expect(e.dataset["tone"]).toBe("success");
    expect(e.dataset["appearance"]).toBe("outlined");
    expect(e.dataset["size"]).toBe("small");
    expect(e.hasAttribute("tabindex")).toBe(false);
    expect(e.hasAttribute("role")).toBe(false);
  });
  it("abbreviates count while retaining exact accessible value", async () => {
    const f = TestBed.createComponent(AtralumeBadge);
    f.componentRef.setInput("count", 125);
    f.detectChanges();
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain("99+");
    expect(f.nativeElement.getAttribute("aria-label")).toBe("125");
  });
  it("requires accessible text on a dot", () => {
    const f = TestBed.createComponent(AtralumeBadge);
    f.componentRef.setInput("dot", true);
    expect(() => f.detectChanges()).toThrow(/Dot badges require/);
  });
});
