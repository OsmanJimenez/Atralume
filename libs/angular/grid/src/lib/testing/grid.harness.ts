import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeGridHarness extends ComponentHarness {
  static hostSelector = "atr-grid";

  async getColumns(): Promise<string | null> {
    return (await this.host()).getAttribute("data-columns");
  }

  async getGap(): Promise<string | null> {
    return (await this.host()).getAttribute("data-gap");
  }
}
