import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListHarness extends ComponentHarness {
  static hostSelector = ".atr-list";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
