import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeAccordionItemHarness extends ComponentHarness {
  static hostSelector = "button[tuiAccordion].atr-accordion-item";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async isExpanded(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-expanded")) === "true";
  }
  async toggle(): Promise<void> {
    await (await this.locatorFor("button")()).click();
  }
}
