import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBreadcrumbOverflowHarness extends ComponentHarness {
  static hostSelector = ".atr-breadcrumb-overflow";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
