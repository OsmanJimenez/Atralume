import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeVisuallyHiddenHarness extends ComponentHarness {
  static hostSelector = ".atr-visually-hidden";

  async isFocusableVariant(): Promise<boolean> {
    return (await this.host()).hasClass("atr-visually-hidden--focusable");
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
