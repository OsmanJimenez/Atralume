import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeFilterHarness extends ComponentHarness {
  static hostSelector = "atr-filter";
  async select(label: string): Promise<void> {
    await (await this.locatorFor(`label:has-text("${label}") input`)()).click();
  }
  async clear(): Promise<void> {
    await (await this.locatorFor(".atr-filter__clear")()).click();
  }
}
