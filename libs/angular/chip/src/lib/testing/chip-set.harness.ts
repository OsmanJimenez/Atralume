import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeChipSetHarness extends ComponentHarness {
  static hostSelector = "atr-chip-set";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
