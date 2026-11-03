import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeLink } from "../../index";
@Component({
  imports: [AtralumeLink],
  template:
    '<a atrLink href="#docs" appearance="standalone" underline="hover"><span aria-hidden="true">→</span>Documentation</a>',
})
class Host {}
describe("AtralumeLink", () => {
  it("preserves anchor href, projected icon, browser target and keyboard focus", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const a = f.nativeElement.querySelector("a") as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe("#docs");
    expect(a.hasAttribute("target")).toBe(false);
    expect(a.getAttribute("role")).toBeNull();
    expect(a.hasAttribute("tuiLink")).toBe(true);
    expect(a.dataset["appearance"]).toBe("standalone");
    expect(a.dataset["underline"]).toBe("hover");
    expect(a.querySelector("span")).not.toBeNull();
    a.focus();
    expect(a.ownerDocument.activeElement).toBe(a);
  });
});
