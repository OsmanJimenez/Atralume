import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCardContentHarness extends ComponentHarness {
  static hostSelector = ".atr-card-content";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
