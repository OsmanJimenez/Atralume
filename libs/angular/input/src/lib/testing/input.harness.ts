import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeInputHarness extends ComponentHarness {
  static hostSelector = ".atr-input";
  async getValue(): Promise<string> {
    return (await this.host()).getProperty<string>("value");
  }
  async setValue(value: string): Promise<void> {
    const host = await this.host();
    await host.clear();
    await host.sendKeys(value);
  }
  async focus(): Promise<void> {
    await (await this.host()).focus();
  }
  async blur(): Promise<void> {
    await (await this.host()).blur();
  }
  async isReadonly(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("readOnly");
  }
  async isInvalid(): Promise<boolean> {
    const h = await this.host();
    return (
      (await h.getAttribute("aria-invalid")) === "true" ||
      ((await h.hasClass("ng-invalid")) &&
        ((await h.hasClass("ng-touched")) || (await h.hasClass("ng-dirty"))))
    );
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
}
