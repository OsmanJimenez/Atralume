import { ComponentHarness, TestKey } from "@angular/cdk/testing";
import { AtralumeCalendarHarness } from "@atralume/angular/calendar";
export class AtralumeDatePickerHarness extends ComponentHarness {
  static hostSelector = "atr-date-picker";
  private readonly input = this.locatorFor('input[type="text"]');
  async openCalendar(): Promise<void> {
    const button = await this.locatorFor('button[aria-haspopup="dialog"]')();
    if ((await button.getAttribute("aria-expanded")) !== "true")
      await button.click();
  }
  async close(): Promise<void> {
    await (await this.input()).sendKeys(TestKey.ESCAPE);
  }
  async getValue(): Promise<string> {
    return (await this.input()).getProperty<string>("value");
  }
  async enterText(value: string): Promise<void> {
    const input = await this.input();
    await input.setInputValue(value);
    await input.dispatchEvent("input");
  }
  async getCalendar(): Promise<AtralumeCalendarHarness> {
    await this.openCalendar();
    return this.documentRootLocatorFactory().locatorFor(
      AtralumeCalendarHarness,
    )();
  }
  async navigateMonth(direction: "next" | "previous" = "next"): Promise<void> {
    const calendar = await this.getCalendar();
    if (direction === "next") await calendar.nextMonth();
    else await calendar.previousMonth();
  }
  async selectDate(id: string): Promise<void> {
    await (await this.getCalendar()).selectDate(id);
  }
  async clear(): Promise<void> {
    await (await this.locatorFor('button[aria-label^="Clear "]')()).click();
  }
  async isDisabled(): Promise<boolean> {
    return (await this.input()).getProperty<boolean>("disabled");
  }
}
