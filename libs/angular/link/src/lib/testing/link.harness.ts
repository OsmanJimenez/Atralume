import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeLinkHarness extends ComponentHarness {
  static hostSelector = ".atr-link";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async getHref(): Promise<string | null> {
    return (await this.host()).getAttribute("href");
  }
  async getAppearance(): Promise<string | null> {
    return (await this.host()).getAttribute("data-appearance");
  }
}
