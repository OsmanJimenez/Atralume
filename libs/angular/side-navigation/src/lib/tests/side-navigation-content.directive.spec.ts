import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeSideNavigationContent } from "../../index";
@Component({
  imports: [AtralumeSideNavigationContent],
  template: "<span atrSideNavigationContent>Projected content</span>",
})
class Host {}
describe("AtralumeSideNavigationContent", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("span") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
