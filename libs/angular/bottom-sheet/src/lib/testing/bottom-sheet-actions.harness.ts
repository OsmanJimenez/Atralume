import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBottomSheetActionsHarness extends ComponentHarness {
  static hostSelector = ".atr-bottom-sheet-actions";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
