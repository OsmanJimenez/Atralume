import { TestBed } from "@angular/core/testing";
import { AtralumeCalendar, AtralumeNativeDateAdapter } from "../../index";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
describe("Calendar selection and keyboard", () => {
  it("navigates month boundaries, respects disabled dates and selects a sorted range", async () => {
    const adapter = new AtralumeNativeDateAdapter();
    const f = TestBed.createComponent(AtralumeCalendar<Date>);
    f.componentRef.setInput("today", adapter.create(2026, 0, 31));
    f.componentRef.setInput("visibleDate", adapter.create(2026, 0, 31));
    f.componentRef.setInput("dateFilter", (date: Date) => date.getDate() !== 1);
    f.autoDetectChanges();
    await f.whenStable();
    const date = f.nativeElement.querySelector(
      '[data-calendar-date="2026-01-31"]',
    ) as HTMLButtonElement;
    date.focus();
    await pressKey(document, "ArrowRight");
    await f.whenStable();
    expect(document.activeElement?.getAttribute("data-calendar-date")).toBe(
      "2026-02-02",
    );
    f.componentRef.setInput("selectionMode", "range");
    await f.whenStable();
    f.componentInstance.select(adapter.create(2026, 1, 8));
    f.componentInstance.select(adapter.create(2026, 1, 4));
    await f.whenStable();
    expect(adapter.serialize(f.componentInstance.rangeValue()!.start!)).toBe(
      "2026-02-04",
    );
    expect(adapter.serialize(f.componentInstance.rangeValue()!.end!)).toBe(
      "2026-02-08",
    );
  });
});
