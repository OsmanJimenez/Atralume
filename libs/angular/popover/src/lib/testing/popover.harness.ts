import { ComponentHarness, TestKey } from "@angular/cdk/testing";

export class AtralumePopoverHarness extends ComponentHarness {
  static hostSelector = 'tui-dropdown[data-appearance="atr-popover"]';

  async getRole(): Promise<string | null> {
    return (await this.host()).getAttribute("role");
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async close(): Promise<void> {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }
}
