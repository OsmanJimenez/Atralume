import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeRadioHarness extends ComponentHarness {
  static hostSelector = ".atr-radio";
  async isChecked(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("checked");
  }
  async toggle(): Promise<void> {
    if (!(await this.isDisabled())) await (await this.host()).click();
  }
  async check(): Promise<void> {
    if (!(await this.isChecked())) await this.toggle();
  }

  async getName(): Promise<string> {
    return (await this.host()).getProperty<string>("name");
  }
  async getValue(): Promise<string> {
    return (await this.host()).getProperty<string>("value");
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
}
