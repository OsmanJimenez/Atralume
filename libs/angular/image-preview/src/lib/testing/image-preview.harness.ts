import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeImagePreviewHarness extends ComponentHarness {
  static hostSelector = "atr-image-preview";
  async open(): Promise<void> {
    await (await this.locatorFor("button")()).click();
  }
  async isTriggerDisabled(): Promise<boolean> {
    return (
      (await (await this.locatorFor("button")()).getAttribute("disabled")) !==
      null
    );
  }
}
