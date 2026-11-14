import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeStatusHarness extends ComponentHarness {
  static hostSelector = ".atr-status";

  async getTone(): Promise<string | null> {
    return (await this.host()).getAttribute("data-tone");
  }

  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
