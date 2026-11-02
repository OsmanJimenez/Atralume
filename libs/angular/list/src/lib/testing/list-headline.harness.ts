import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListHeadlineHarness extends ComponentHarness {
  static hostSelector = ".atr-list-headline";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
