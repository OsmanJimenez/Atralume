import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeEmptyStateHarness extends ComponentHarness {
  static hostSelector = "atr-empty-state";
  async getTitle(): Promise<string> {
    return (await this.locatorFor("h2")()).text();
  }
  async getDescription(): Promise<string | null> {
    return (await this.locatorForOptional("p")())?.text() ?? null;
  }
}
