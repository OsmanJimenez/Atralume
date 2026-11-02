import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
  AtralumeListTrailing,
} from "../../index";
@Component({
  imports: [
    AtralumeList,
    AtralumeListItem,
    AtralumeListHeadline,
    AtralumeListSupporting,
    AtralumeListTrailing,
  ],
  template:
    '<ul atrList><li><a atrListItem href="#account"><span><span atrListHeadline>Account</span><span atrListSupporting>Manage profile</span></span><span atrListTrailing>\u2192</span></a></li><li atrListItem>Static information</li></ul>',
})
class Host {}
describe("List", () => {
  it("preserves semantic composition and observable behavior", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("ul")?.getAttribute("role")).toBeNull();
    expect(e.querySelector("a")?.getAttribute("href")).toBe("#account");
    expect(e.querySelector(".atr-list-supporting")?.textContent).toBe(
      "Manage profile",
    );
  });
});
