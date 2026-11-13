import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TuiAccordion } from "@taiga-ui/kit";
import {
  AtralumeAccordion,
  AtralumeAccordionItem,
  AtralumeAccordionHeader,
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
    '<tui-accordion atrAccordion [closeOthers]="true"><button tuiAccordion atrAccordionItem atrAccordionHeader>Profile</button><tui-expand atrAccordionPanel><p>Profile details</p></tui-expand><button tuiAccordion atrAccordionItem atrAccordionHeader>Security</button><tui-expand atrAccordionPanel><p>Security details</p></tui-expand></tui-accordion>',
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
    const panelId = buttons[0].getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(e.querySelector(`#${panelId}`)?.tagName.toLowerCase()).toBe(
      "tui-expand",
    );
    buttons[1].click();
    f.detectChanges();
    await f.whenStable();
    expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
    expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
  });
});
