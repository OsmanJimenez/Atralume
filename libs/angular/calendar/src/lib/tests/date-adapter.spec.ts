import { AtralumeNativeDateAdapter } from "../../index";
describe("Native civil-date adapter", () => {
  const adapter = new AtralumeNativeDateAdapter("en-US", 1);
  it("rejects normalization of invalid written dates and parses localized numeric dates", () => {
    expect(adapter.parse("2026-02-29")).toBeNull();
    expect(adapter.parse("2026-13-01")).toBeNull();
    expect(adapter.parse("2024-02-29")).not.toBeNull();
    expect(adapter.serialize(adapter.parse("31/10/2026", "es-CO")!)).toBe(
      "2026-10-31",
    );
    expect(adapter.serialize(adapter.parse("10/31/2026")!)).toBe("2026-10-31");
  });
  it("clamps month and year arithmetic without using instant serialization", () => {
    expect(
      adapter.serialize(adapter.addMonths(adapter.create(2026, 0, 31), 1)),
    ).toBe("2026-02-28");
    expect(
      adapter.serialize(adapter.addYears(adapter.create(2024, 1, 29), 1)),
    ).toBe("2025-02-28");
    const day = adapter.addDays(adapter.create(2026, 2, 7), 1);
    expect(adapter.serialize(day)).toBe("2026-03-08");
    expect(day.getHours()).toBe(12);
    expect(adapter.firstDayOfWeek()).toBe(1);
  });
});
