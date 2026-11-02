import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationContentHarness extends ComponentHarness {
  static hostSelector = ".atr-side-navigation-content";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
