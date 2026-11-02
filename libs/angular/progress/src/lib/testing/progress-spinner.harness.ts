import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeProgressSpinnerHarness extends ComponentHarness {
  static hostSelector = ".atr-progress-spinner";
  async getValue(): Promise<number | null> {
    const value = await (await this.host()).getAttribute("aria-valuenow");
    return value === null ? null : Number(value);
  }
  async getMin(): Promise<number | null> {
    const value = await (await this.host()).getAttribute("aria-valuemin");
    return value === null ? null : Number(value);
  }
  async getMax(): Promise<number | null> {
    const value = await (await this.host()).getAttribute("aria-valuemax");
    return value === null ? null : Number(value);
  }
  async isIndeterminate(): Promise<boolean> {
    return (await (await this.host()).getAttribute("aria-valuenow")) === null;
  }
  async getAccessibleName(): Promise<string | null> {
    return (await this.host()).getAttribute("aria-label");
  }
}
