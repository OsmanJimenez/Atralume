import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSpeedDialHarness extends ComponentHarness {
  static hostSelector = "atr-speed-dial";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async toggle(): Promise<void> {
    await (await this.locatorFor("button.atr-fab")()).click();
  }
  async isOpen(): Promise<boolean> {
    return (
      (await (
        await this.locatorFor("button.atr-fab")()
      ).getAttribute("aria-expanded")) === "true"
    );
  }
}
