import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeBreadcrumbItem } from "../../index";
@Component({
  imports: [AtralumeBreadcrumbItem],
  template: '<a atrBreadcrumbItem href="#destination">Projected content</a>',
})
class Host {}
describe("AtralumeBreadcrumbItem", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("a") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
