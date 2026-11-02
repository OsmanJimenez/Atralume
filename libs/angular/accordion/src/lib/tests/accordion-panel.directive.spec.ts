import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeAccordionPanel } from "../../index";
@Component({
  imports: [AtralumeAccordionPanel],
  template: "<span atrAccordionPanel>Projected content</span>",
})
class Host {}
describe("AtralumeAccordionPanel", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("span") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("role")).toBeNull();
  });
});
