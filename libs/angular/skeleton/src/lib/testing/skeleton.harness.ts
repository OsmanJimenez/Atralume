import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSkeletonHarness extends ComponentHarness {
  static hostSelector = "atr-skeleton";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
