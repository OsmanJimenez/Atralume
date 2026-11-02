import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSpeedDialActionHarness extends ComponentHarness {
  static hostSelector = ".atr-speed-dial-action";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async click(): Promise<void> {
    await (await this.host()).click();
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
}
