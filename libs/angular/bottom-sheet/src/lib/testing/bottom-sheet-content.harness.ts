import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBottomSheetContentHarness extends ComponentHarness {
  static hostSelector = ".atr-bottom-sheet-content";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
