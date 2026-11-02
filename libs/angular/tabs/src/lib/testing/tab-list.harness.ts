import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeTabListHarness extends ComponentHarness {
  static hostSelector = ".atr-tab-list";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
