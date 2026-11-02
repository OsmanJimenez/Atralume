import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeMenuGroupHarness extends ComponentHarness {
  static hostSelector = ".atr-menu-group";
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
