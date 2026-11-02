import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationContainerHarness extends ComponentHarness {
  static hostSelector = "atr-side-navigation-container";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
