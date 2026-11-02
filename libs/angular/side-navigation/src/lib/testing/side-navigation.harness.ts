import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationHarness extends ComponentHarness {
  static hostSelector = "atr-side-navigation";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async isOpen(): Promise<boolean> {
    return (await (await this.host()).getAttribute("data-opened")) === "true";
  }
}
