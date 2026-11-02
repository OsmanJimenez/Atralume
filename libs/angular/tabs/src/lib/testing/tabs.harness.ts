import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeTabsHarness extends ComponentHarness {
  static hostSelector = "atr-tabs";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
