import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeOtpInputHarness extends ComponentHarness {
  static hostSelector = "atr-otp-input";

  private readonly input = this.locatorFor("input[tuiInputPin]");

  async getValue(): Promise<string> {
    return (await this.input()).getProperty<string>("value");
  }

  async setValue(value: string): Promise<void> {
    const input = await this.input();
    await input.clear();
    await input.sendKeys(value);
  }

  async isDisabled(): Promise<boolean> {
    return await (await this.input()).getProperty<boolean>("disabled");
  }
}
