import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBottomSheetTitleHarness extends ComponentHarness {
  static hostSelector = ".atr-bottom-sheet-title";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
