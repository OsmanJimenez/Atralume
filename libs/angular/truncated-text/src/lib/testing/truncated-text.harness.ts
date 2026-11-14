import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeTruncatedTextHarness extends ComponentHarness {
  static hostSelector = "atr-truncated-text";

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
