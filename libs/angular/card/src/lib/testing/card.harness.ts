import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCardHarness extends ComponentHarness {
  static hostSelector = "atr-card";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
