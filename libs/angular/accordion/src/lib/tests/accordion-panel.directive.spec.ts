import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TuiAccordion } from "@taiga-ui/kit";
import {
  AtralumeAccordion,
  AtralumeAccordionHeader,
  AtralumeAccordionItem,
  AtralumeAccordionPanel,
} from "../../index";
@Component({
  imports: [
    TuiAccordion,
    AtralumeAccordion,
    AtralumeAccordionItem,
    AtralumeAccordionHeader,
    AtralumeAccordionPanel,
  ],
  template:
    "<tui-accordion atrAccordion><button tuiAccordion atrAccordionItem atrAccordionHeader>Header</button><tui-expand atrAccordionPanel>Projected content</tui-expand></tui-accordion>",
})
class Host {}
describe("AtralumeAccordionPanel", () => {
  it("preserves native projected content without inventing interaction", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement.querySelector("tui-expand") as HTMLElement;
    expect(element.textContent).toContain("Projected content");
    expect(element.classList).toContain("atr-accordion-panel");
  });
});
