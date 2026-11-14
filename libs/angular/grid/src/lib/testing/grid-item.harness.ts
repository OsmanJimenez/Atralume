import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeGridItemHarness extends ComponentHarness {
  static hostSelector = ".atr-grid-item";

  async getSpan(): Promise<string | null> {
    return (await this.host()).getAttribute("data-span");
  }
}
