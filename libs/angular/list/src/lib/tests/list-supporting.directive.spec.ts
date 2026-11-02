import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeListSupporting } from "../../index";
@Component({
  imports: [AtralumeListSupporting],
  template: "<span atrListSupporting>Projected content</span>",
})
class Host {}
describe("AtralumeListSupporting", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("span") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
