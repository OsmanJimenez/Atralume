import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeFabHarness extends ComponentHarness {
  static hostSelector = ".atr-fab";
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
