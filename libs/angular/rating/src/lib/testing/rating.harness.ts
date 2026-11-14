import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeRatingHarness extends ComponentHarness {
  static hostSelector = "atr-rating";

  private readonly range = this.locatorFor('input[type="range"]');

  async getValue(): Promise<number> {
    return Number(await (await this.range()).getProperty<string>("value"));
  }

  async isDisabled(): Promise<boolean> {
    return await (await this.range()).getProperty<boolean>("disabled");
  }
}
