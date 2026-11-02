import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeChipHarness extends ComponentHarness {
  static hostSelector = "atr-chip";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute("data-selected")) === "true";
  }
  async select(): Promise<void> {
    await (await this.locatorFor("button.action")()).click();
  }
  async remove(): Promise<void> {
    await (await this.locatorFor("button.remove")()).click();
  }
}
