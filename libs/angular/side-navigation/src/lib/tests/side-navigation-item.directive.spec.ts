import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeSideNavigationItem } from "../../index";
@Component({
  imports: [AtralumeSideNavigationItem],
  template:
    '<a atrSideNavigationItem href="#destination">Projected content</a>',
})
class Host {}
describe("AtralumeSideNavigationItem", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("a") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
