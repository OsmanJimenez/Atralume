import { ComponentHarness, TestKey } from "@angular/cdk/testing";
export class AtralumeTimePickerHarness extends ComponentHarness {
  static hostSelector = "atr-time-picker";
  private readonly input = this.locatorFor('input[type="time"]');
  async getValue(): Promise<string> {
    return (await this.input()).getProperty<string>("value");
  }
  async setValue(value: string): Promise<void> {
    const input = await this.input();
    await input.setInputValue(value);
    await input.dispatchEvent("input");
  }
  async open(): Promise<void> {
    await (await this.locatorFor('button[aria-haspopup="dialog"]')()).click();
  }
  async close(): Promise<void> {
    await (await this.input()).sendKeys(TestKey.ESCAPE);
  }
  async clear(): Promise<void> {
    await (await this.locatorFor('button[aria-label^="Clear "]')()).click();
  }
}
