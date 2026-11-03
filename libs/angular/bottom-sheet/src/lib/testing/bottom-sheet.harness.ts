import { ComponentHarness, TestKey } from "@angular/cdk/testing";

export class AtralumeBottomSheetHarness extends ComponentHarness {
  static hostSelector = 'tui-dialog[data-appearance="atr-bottom-sheet"]';

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
