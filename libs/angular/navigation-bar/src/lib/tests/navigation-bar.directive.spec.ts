import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeNavigationBar, AtralumeNavigationItem } from "../../index";
@Component({
  imports: [AtralumeNavigationBar, AtralumeNavigationItem],
  template:
    '<atr-navigation-bar><a atrNavigationItem href="#home" active><span aria-hidden="true">\u2302</span><span>Home</span></a><a atrNavigationItem href="#projects"><span aria-hidden="true">\u25c7</span><span>Projects</span></a><a atrNavigationItem href="#profile"><span aria-hidden="true">\u25cb</span><span>Profile</span></a></atr-navigation-bar>',
})
class Host {}
describe("Navigation Bar", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("nav[tuiNavigationNav]")).toBeTruthy();
    expect(e.querySelector("nav")?.getAttribute("role")).toBeNull();
    expect(e.querySelector("[aria-current=page]")?.getAttribute("href")).toBe(
      "#home",
    );
    expect(e.querySelectorAll("[role=tab]").length).toBe(0);
  });
});
