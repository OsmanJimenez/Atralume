import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSideNavigationItemHarness extends ComponentHarness {
  static hostSelector = ".atr-side-navigation-item";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async isSelected(): Promise<boolean> {
    const h = await this.host();
    return (
      (await h.getAttribute("aria-selected")) === "true" ||
      (await h.getAttribute("aria-current")) === "page"
    );
  }
}
