import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeNavigationBarHarness extends ComponentHarness {
  static hostSelector = ".atr-navigation-bar";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
