import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumePaginationHarness extends ComponentHarness {
  static hostSelector = "atr-pagination";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
  async getCurrentPage(): Promise<number> {
    return Number(
      await (await this.locatorFor("[aria-current=page]")()).text(),
    );
  }
}
