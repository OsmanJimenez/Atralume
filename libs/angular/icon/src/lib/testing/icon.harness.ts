import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeIconHarness extends ComponentHarness {
  static hostSelector = ".atr-icon";
  async getName(): Promise<string | null> {
    return (await this.host()).getAttribute("data-name");
  }
  async getLabel(): Promise<string | null> {
    return (await this.host()).getAttribute("aria-label");
  }
  async isDecorative(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-hidden")) === "true";
  }
  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }
}
