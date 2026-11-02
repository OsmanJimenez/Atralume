import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListItemHarness extends ComponentHarness {
  static hostSelector = ".atr-list-item";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
