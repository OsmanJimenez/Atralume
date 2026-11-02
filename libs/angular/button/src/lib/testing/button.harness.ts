import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeButtonHarness extends ComponentHarness {
  static hostSelector = ".atr-button";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async getAppearance(): Promise<string | null> {
    return (await this.host()).getAttribute("data-appearance");
  }
  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }
  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-disabled")) === "true";
  }
  async isLoading(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-busy")) === "true";
  }
  async click(): Promise<void> {
    await (await this.host()).click();
  }
}
