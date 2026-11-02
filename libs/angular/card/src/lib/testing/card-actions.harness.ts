import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCardActionsHarness extends ComponentHarness {
  static hostSelector = ".atr-card-actions";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
