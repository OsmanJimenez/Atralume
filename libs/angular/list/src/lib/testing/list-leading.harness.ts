import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListLeadingHarness extends ComponentHarness {
  static hostSelector = ".atr-list-leading";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
