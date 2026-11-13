import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeAccordionPanelHarness extends ComponentHarness {
  static hostSelector = "tui-expand.atr-accordion-panel";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
