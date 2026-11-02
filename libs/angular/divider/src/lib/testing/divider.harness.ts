import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeDividerHarness extends ComponentHarness {
  static hostSelector = ".atr-divider";
  async getOrientation(): Promise<string | null> {
    return (await this.host()).getAttribute("data-orientation");
  }
  async isDecorative(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-hidden")) === "true";
  }
}
