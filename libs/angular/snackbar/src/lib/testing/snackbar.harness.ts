import { ComponentHarness, TestKey } from "@angular/cdk/testing";
export class AtralumeSnackbarHarness extends ComponentHarness {
  static hostSelector = "atr-snackbar-panel";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async getAccessibleName(): Promise<string | null> {
    return (await this.host()).getAttribute("aria-label");
  }
  async pressEscape(): Promise<void> {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }
}
