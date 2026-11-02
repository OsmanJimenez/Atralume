import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCardHeaderHarness extends ComponentHarness {
  static hostSelector = ".atr-card-header";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
