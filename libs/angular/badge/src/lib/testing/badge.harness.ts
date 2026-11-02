import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBadgeHarness extends ComponentHarness {
  static hostSelector = ".atr-badge";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async getTone(): Promise<string | null> {
    return (await this.host()).getAttribute("data-tone");
  }
  async getAppearance(): Promise<string | null> {
    return (await this.host()).getAttribute("data-appearance");
  }
}
