import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeDialogContentHarness extends ComponentHarness {
  static hostSelector = ".atr-dialog-content";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
