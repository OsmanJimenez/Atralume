import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBottomSheetCloseHarness extends ComponentHarness {
  static hostSelector = ".atr-bottom-sheet-close";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
