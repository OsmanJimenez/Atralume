import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationLabelHarness extends ComponentHarness {
  static hostSelector = ".atr-side-navigation-label";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
