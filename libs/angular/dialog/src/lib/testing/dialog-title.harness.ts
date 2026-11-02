import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeDialogTitleHarness extends ComponentHarness {
  static hostSelector = ".atr-dialog-title";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
