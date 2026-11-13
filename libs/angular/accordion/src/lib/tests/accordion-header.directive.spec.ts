import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TuiAccordion } from "@taiga-ui/kit";
import {
  AtralumeAccordion,
  AtralumeAccordionHeader,
  AtralumeAccordionItem,
} from "../../index";
@Component({
  imports: [
    TuiAccordion,
    AtralumeAccordion,
    AtralumeAccordionItem,
    AtralumeAccordionHeader,
  ],
  template:
    "<tui-accordion atrAccordion><button tuiAccordion atrAccordionItem atrAccordionHeader>Projected content</button><tui-expand /></tui-accordion>",
})
class Host {}
describe("AtralumeAccordionHeader", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("button") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.getAttribute("type")).toBe("button");
    expect(element.getAttribute("aria-expanded")).toBe("false");
  });
});
