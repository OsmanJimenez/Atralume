import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
} from "@angular/cdk/testing";
export class AtralumeCalendarHarness extends ComponentHarness {
  static hostSelector = "atr-calendar";
  static with(
    options: BaseHarnessFilters = {},
  ): HarnessPredicate<AtralumeCalendarHarness> {
    return new HarnessPredicate(AtralumeCalendarHarness, options);
  }
  async getVisibleMonth(): Promise<string> {
    return (await this.locatorFor(".month-label")()).text();
  }
  async nextMonth(): Promise<void> {
    await (await this.locatorFor('button[aria-label="Next month"]')()).click();
  }
  async previousMonth(): Promise<void> {
    await (
      await this.locatorFor('button[aria-label="Previous month"]')()
    ).click();
  }
  async selectDate(id: string): Promise<void> {
    const buttons = await this.locatorForAll("button[data-calendar-date]")();
    for (const button of buttons)
      if ((await button.getAttribute("data-calendar-date")) === id) {
        await button.click();
        return;
      }
    throw new Error("Date not in visible calendar: " + id);
  }
  async getSelectedDates(): Promise<string[]> {
    const buttons = await this.locatorForAll(
      '[aria-selected="true"] button[data-calendar-date]',
    )();
    return Promise.all(
      buttons.map(
        async (button) =>
          (await button.getAttribute("data-calendar-date")) ?? "",
      ),
    );
  }
}
