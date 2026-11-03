import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeFormFieldHarness extends ComponentHarness {
  static hostSelector = "atr-form-field";
  private readonly label = this.locatorForOptional("label[tuiLabel], .atr-form-field__label");
  private readonly hint = this.locatorForOptional(".atr-form-field__hint");
  private readonly error = this.locatorForOptional(".atr-form-field__error");
  async getLabel(): Promise<string> {
    return (await this.label())?.text() ?? "";
  }
  async getHint(): Promise<string | null> {
    return (await this.hint())?.text() ?? null;
  }
  async getError(): Promise<string | null> {
    return (await this.error())?.text() ?? null;
  }
  async isRequired(): Promise<boolean> {
    return (await this.getLabel()).includes("*");
  }
  async getAppearance(): Promise<string | null> {
    return (await this.host()).getAttribute("data-appearance");
  }
  readonly getControl = this.locatorFor("input, textarea");
}
