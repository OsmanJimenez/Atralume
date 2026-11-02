import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBreadcrumbItemHarness extends ComponentHarness {
  static hostSelector = ".atr-breadcrumb-item";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
