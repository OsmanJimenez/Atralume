import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeBreadcrumbOverflow } from "../../index";
@Component({
  imports: [AtralumeBreadcrumbOverflow],
  template:
    '<details atrBreadcrumbOverflow><summary>Earlier pages</summary><a href="#history">History</a></details>',
})
class Host {}
describe("AtralumeBreadcrumbOverflow", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector(
      "details",
    ) as HTMLElement;
    expect(element.textContent).toContain("Earlier pages");
    expect(element.getAttribute("role")).toBeNull();
  });
});
