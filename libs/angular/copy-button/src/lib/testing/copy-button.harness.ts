import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeCopyButtonHarness extends ComponentHarness {
  static hostSelector = "button.atr-copy-button";

  async getValue(): Promise<string | null> {
    return (await this.host()).getAttribute("tuiButtonCopy");
  }

  async isCopied(): Promise<boolean> {
    return (await (await this.host()).getAttribute("data-copied")) === "true";
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
