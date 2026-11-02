import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeMenuSeparatorHarness extends ComponentHarness {
  static hostSelector = ".atr-menu-separator";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async click(): Promise<void> {
    await (await this.host()).click();
  }
  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-disabled")) === "true";
  }
  async isChecked(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-checked")) === "true";
  }
}
