import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeAccordion,
  AtralumeAccordionItem,
  AtralumeAccordionHeader,
  AtralumeAccordionPanel,
} from "../../index";
@Component({
  imports: [
    AtralumeAccordion,
    AtralumeAccordionItem,
    AtralumeAccordionHeader,
    AtralumeAccordionPanel,
  ],
  template:
    '<atr-accordion><atr-accordion-item id="profile"><span atrAccordionHeader>Profile</span><p atrAccordionPanel>Profile details</p></atr-accordion-item><atr-accordion-item id="security"><span atrAccordionHeader>Security</span><p atrAccordionPanel>Security details</p></atr-accordion-item></atr-accordion>',
})
class Host {}
describe("Accordion", () => {
  it("preserves semantic composition and observable behavior", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const buttons = e.querySelectorAll("button");
    buttons[0].click();
    f.detectChanges();
    await f.whenStable();
    expect(buttons[0].getAttribute("aria-expanded")).toBe("true");
    expect(
      e.querySelector("#profile-panel")?.getAttribute("aria-labelledby"),
    ).toBe("profile-header");
    buttons[1].click();
    f.detectChanges();
    await f.whenStable();
    expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
    expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
  });
});
