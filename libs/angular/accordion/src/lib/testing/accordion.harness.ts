import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeAccordionHarness extends ComponentHarness {
  static hostSelector = "tui-accordion.atr-accordion";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
