import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeImageHarness extends ComponentHarness {
  static hostSelector = "atr-image";
  async getState(): Promise<string | null> {
    return (await this.host()).getAttribute("data-state");
  }
  async getAlt(): Promise<string | null> {
    return (
      (await this.locatorForOptional("img")())?.getAttribute("alt") ?? null
    );
  }
  async requestPreview(): Promise<void> {
    const trigger = await this.locatorForOptional("button")();
    if (trigger) await trigger.click();
  }
}
