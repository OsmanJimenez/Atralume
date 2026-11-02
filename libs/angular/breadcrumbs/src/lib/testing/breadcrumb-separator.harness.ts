import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeBreadcrumbSeparatorHarness extends ComponentHarness {
  static hostSelector = ".atr-breadcrumb-separator";
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
