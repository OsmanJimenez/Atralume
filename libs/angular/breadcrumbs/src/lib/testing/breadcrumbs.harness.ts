import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBreadcrumbsHarness extends ComponentHarness {
  static hostSelector = ".atr-breadcrumbs";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
