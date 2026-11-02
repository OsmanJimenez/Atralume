import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCardMediaHarness extends ComponentHarness {
  static hostSelector = ".atr-card-media";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
