import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeListMetadataHarness extends ComponentHarness {
  static hostSelector = ".atr-list-metadata";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
