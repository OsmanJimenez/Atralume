import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListTrailingHarness extends ComponentHarness {
  static hostSelector = ".atr-list-trailing";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
