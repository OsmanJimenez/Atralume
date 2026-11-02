import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationHeaderHarness extends ComponentHarness {
  static hostSelector = ".atr-side-navigation-header";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
