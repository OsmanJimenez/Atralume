import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeListTrailing } from "../../index";
@Component({
  imports: [AtralumeListTrailing],
  template: "<span atrListTrailing>Projected content</span>",
})
class Host {}
describe("AtralumeListTrailing", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("span") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
