import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeActionBarHarness extends ComponentHarness {
  static hostSelector = "atr-action-bar";

  async isExpanded(): Promise<boolean> {
    return (await this.host()).getAttribute("data-expanded") !== null;
  }

  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }

  async getActionCount(): Promise<number> {
    return (await this.locatorForAll("button, a")()).length;
  }
}
