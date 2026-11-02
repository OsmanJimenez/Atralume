import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeDialogCloseHarness extends ComponentHarness {
  static hostSelector = ".atr-dialog-close";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
