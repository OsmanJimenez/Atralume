import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeAccordionHeaderHarness extends ComponentHarness {
  static hostSelector = "button[tuiAccordion].atr-accordion-header";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
