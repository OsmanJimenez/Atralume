import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationGroupHarness extends ComponentHarness {
  static hostSelector = ".atr-side-navigation-group";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
