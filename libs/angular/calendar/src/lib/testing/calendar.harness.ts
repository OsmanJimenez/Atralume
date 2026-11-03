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

  private readonly cells = this.locatorForAll(
    '[automation-id="tui-calendar-sheet__cell"]',
  );

  async getVisibleMonth(): Promise<string> {
    const spin = await this.locatorForOptional(
      "tui-calendar-spin, .t-title, button",
    )();
    return spin ? spin.text() : (await this.host()).text();
  }

  async nextMonth(): Promise<void> {
    const buttons = await this.locatorForAll("button, [tuiIconButton]")();
    if (buttons.length < 2) throw new Error("Calendar pagination not found");
    await buttons[buttons.length - 1].click();
  }

  async previousMonth(): Promise<void> {
    const buttons = await this.locatorForAll("button, [tuiIconButton]")();
    if (!buttons.length) throw new Error("Calendar pagination not found");
    await buttons[0].click();
  }

  async selectDate(id: string): Promise<void> {
    // id format YYYY-MM-DD — match by day number within visible month.
    const day = Number(id.split("-")[2]);
    const cells = await this.cells();
    for (const cell of cells) {
      const text = (await cell.text()).trim();
      if (text === String(day) && !(await cell.hasClass("t-cell_unavailable"))) {
        await cell.click();
        return;
      }
    }
    throw new Error("Date not in visible calendar: " + id);
  }

  async getSelectedDates(): Promise<string[]> {
    const cells = await this.cells();
    const selected: string[] = [];
    for (const cell of cells) {
      const range = await cell.getAttribute("data-range");
      if (range === "active" || range === "start" || range === "end") {
        selected.push((await cell.text()).trim());
      }
    }
    return selected;
  }
}
