import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeSwitchHarness extends ComponentHarness {
  static hostSelector = ".atr-switch";
  async isChecked(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("checked");
  }
  async toggle(): Promise<void> {
    if (!(await this.isDisabled())) await (await this.host()).click();
  }
  async check(): Promise<void> {
    if (!(await this.isChecked())) await this.toggle();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
}
