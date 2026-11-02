import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeTabHarness extends ComponentHarness {
  static hostSelector = "button[role=tab]";
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
  async click(): Promise<void> {
    await (await this.host()).click();
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
}
