import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListSupportingHarness extends ComponentHarness {
  static hostSelector = ".atr-list-supporting";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
