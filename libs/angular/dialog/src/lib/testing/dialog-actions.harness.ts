import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeDialogActionsHarness extends ComponentHarness {
  static hostSelector = ".atr-dialog-actions";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
