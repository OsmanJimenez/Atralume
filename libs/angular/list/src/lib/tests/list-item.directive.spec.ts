import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeListItem } from "../../index";
@Component({
  imports: [AtralumeListItem],
  template: "<ul><li atrListItem>Projected content</li></ul>",
})
class Host {}
describe("AtralumeListItem", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("li") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
