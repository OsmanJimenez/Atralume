import { Injectable, type Provider } from "@angular/core";
export interface AtralumeDateRange<D> {
  readonly start: D | null;
  readonly end: D | null;
}
export type AtralumeDateFormat = "input" | "full" | "month-year";
/** Calendar arithmetic and parsing are replaceable without changing picker contracts. */
@Injectable({
  providedIn: "root",
  useFactory: () => new AtralumeNativeDateAdapter(),
})
export abstract class AtralumeDateAdapter<D> {
  abstract readonly locale: string;
  abstract today(): D;
  abstract create(year: number, month: number, day: number): D;
  abstract parse(value: string, locale?: string): D | null;
  abstract format(
    value: D,
    format?: AtralumeDateFormat,
    locale?: string,
  ): string;
  abstract compare(a: D, b: D): number;
  abstract addDays(value: D, days: number): D;
  abstract addMonths(value: D, months: number): D;
  abstract addYears(value: D, years: number): D;
  abstract year(value: D): number;
  abstract month(value: D): number;
  abstract day(value: D): number;
  abstract weekday(value: D): number;
  abstract daysInMonth(year: number, month: number): number;
  abstract firstDayOfWeek(locale?: string): number;
  abstract isValid(value: unknown): value is D;
  abstract weekdayName(day: number, locale?: string): string;
  abstract serialize(value: D): string;
}
/** A Date represents a local civil day, normalized to noon. It is not an instant contract. */
export class AtralumeNativeDateAdapter extends AtralumeDateAdapter<Date> {
  constructor(
    readonly locale = "en-US",
    private readonly weekStart = 0,
  ) {
    super();
    if (!Number.isInteger(weekStart) || weekStart < 0 || weekStart > 6)
      throw new Error("firstDayOfWeek must be 0..6.");
  }
  today(): Date {
    const value = new Date();
    return this.create(value.getFullYear(), value.getMonth(), value.getDate());
  }
  create(year: number, month: number, day: number): Date {
    const value = new Date(0);
    value.setHours(12, 0, 0, 0);
    value.setFullYear(year, month, day);
    return value;
  }
  year(value: Date): number {
    return value.getFullYear();
  }
  month(value: Date): number {
    return value.getMonth();
  }
  day(value: Date): number {
    return value.getDate();
  }
  weekday(value: Date): number {
    return value.getDay();
  }
  isValid(value: unknown): value is Date {
    return value instanceof Date && Number.isFinite(value.getTime());
  }
  firstDayOfWeek(): number {
    return this.weekStart;
  }
  daysInMonth(year: number, month: number): number {
    return this.create(year, month + 1, 0).getDate();
  }
  compare(a: Date, b: Date): number {
    return (
      this.year(a) - this.year(b) ||
      this.month(a) - this.month(b) ||
      this.day(a) - this.day(b)
    );
  }
  addDays(value: Date, days: number): Date {
    return this.create(
      this.year(value),
      this.month(value),
      this.day(value) + days,
    );
  }
  addMonths(value: Date, months: number): Date {
    const first = this.create(this.year(value), this.month(value) + months, 1);
    return this.create(
      this.year(first),
      this.month(first),
      Math.min(
        this.day(value),
        this.daysInMonth(this.year(first), this.month(first)),
      ),
    );
  }
  addYears(value: Date, years: number): Date {
    return this.addMonths(value, years * 12);
  }
  parse(text: string, locale = this.locale): Date | null {
    const value = text.trim();
    if (!value) return null;
    let year: number, month: number, day: number;
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (iso) {
      year = Number(iso[1]);
      month = Number(iso[2]) - 1;
      day = Number(iso[3]);
    } else {
      const digits = value.match(/\d+/g);
      if (!digits || digits.length !== 3) return null;
      const order = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        numberingSystem: "latn",
      })
        .formatToParts(this.create(2006, 10, 22))
        .filter((part) => ["year", "month", "day"].includes(part.type));
      const fields = new Map(
        order.map((part, index) => [part.type, Number(digits[index])]),
      );
      year = fields.get("year")!;
      month = fields.get("month")! - 1;
      day = fields.get("day")!;
      if (!/^\D*\d+\D+\d+\D+\d+\D*$/.test(value) || year < 100) return null;
    }
    const date = this.create(year, month, day);
    return this.isValid(date) &&
      this.year(date) === year &&
      this.month(date) === month &&
      this.day(date) === day
      ? date
      : null;
  }
  format(
    value: Date,
    format: AtralumeDateFormat = "input",
    locale = this.locale,
  ): string {
    if (!this.isValid(value)) return "";
    const options: Intl.DateTimeFormatOptions =
      format === "input"
        ? {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            numberingSystem: "latn",
          }
        : format === "month-year"
          ? { year: "numeric", month: "long" }
          : { year: "numeric", month: "long", day: "numeric", weekday: "long" };
    return new Intl.DateTimeFormat(locale, options).format(value);
  }
  weekdayName(day: number, locale = this.locale): string {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      this.create(2024, 0, 7 + day),
    );
  }
  serialize(value: Date): string {
    return (
      String(this.year(value)).padStart(4, "0") +
      "-" +
      String(this.month(value) + 1).padStart(2, "0") +
      "-" +
      String(this.day(value)).padStart(2, "0")
    );
  }
}
export function provideAtralumeNativeDateAdapter(
  options: { locale?: string; firstDayOfWeek?: number } = {},
): Provider[] {
  return [
    {
      provide: AtralumeDateAdapter,
      useFactory: () =>
        new AtralumeNativeDateAdapter(
          options.locale ?? "en-US",
          options.firstDayOfWeek ?? 0,
        ),
    },
  ];
}
