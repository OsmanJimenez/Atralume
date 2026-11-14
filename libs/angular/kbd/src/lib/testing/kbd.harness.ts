import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeKbdHarness extends ComponentHarness {
  static hostSelector = "kbd.atr-kbd";

  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
