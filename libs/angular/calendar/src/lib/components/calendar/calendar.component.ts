import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
} from "@angular/core";
import { TuiDay, TuiDayRange, TuiMonth } from "@taiga-ui/cdk/date-time";
import { TuiCalendar } from "@taiga-ui/core";
import { TuiCalendarRange } from "@taiga-ui/kit";
import type { AtralumeDateRange } from "../../adapters/date-adapter";

function toDay(value: Date | null | undefined): TuiDay | null {
  return value ? TuiDay.fromLocalNativeDate(value) : null;
}

function fromDay(value: TuiDay | null): Date | null {
  return value ? value.toLocalNativeDate() : null;
}

/**
 * Thin calendar over Taiga `tui-calendar` / `tui-calendar-range`.
 * Public value stays native `Date` / `{ start, end }`; CDK `TuiDay` is internal.
 */
@Component({
  selector: "atr-calendar",
  standalone: true,
  imports: [TuiCalendar, TuiCalendarRange],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-calendar" },
})
export class AtralumeCalendar {
  readonly label = input("Choose date");
  readonly value = model<Date | null>(null);
  readonly rangeValue = model<AtralumeDateRange<Date> | null>(null);
  readonly selectionMode = input<"single" | "range">("single");
  readonly visibleDate = model<Date | null>(null);
  readonly today = input(new Date());
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly dateFilter = input<(value: Date) => boolean>(() => true);
  readonly showAdjacentDays = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });

  protected readonly tuiMin = computed(
    () => toDay(this.min()) ?? TuiDay.currentLocal().append({ year: -100 }),
  );
  protected readonly tuiMax = computed(
    () => toDay(this.max()) ?? TuiDay.currentLocal().append({ year: 100 }),
  );
  protected readonly tuiDay = computed(() => toDay(this.value()));
  protected readonly tuiRange = computed(() => {
    const range = this.rangeValue();
    const start = toDay(range?.start ?? null);
    const end = toDay(range?.end ?? null);
    return start && end ? new TuiDayRange(start, end) : null;
  });
  protected readonly tuiMonth = computed(() => {
    const visible =
      this.visibleDate() ??
      this.value() ??
      this.rangeValue()?.start ??
      this.today();
    return new TuiMonth(visible.getFullYear(), visible.getMonth());
  });
  protected readonly disabledItemHandler = computed(() => {
    const filter = this.dateFilter();
    const blocked = this.disabled() || this.readonly();
    return (day: TuiDay) =>
      blocked || !filter(day.toLocalNativeDate());
  });

  protected onDayClick(day: TuiDay): void {
    if (this.disabled() || this.readonly()) return;
    this.value.set(fromDay(day));
    this.visibleDate.set(fromDay(day));
  }

  protected onRange(value: TuiDayRange | null): void {
    if (this.disabled() || this.readonly()) return;
    this.rangeValue.set(
      value
        ? {
            start: fromDay(value.from),
            end: fromDay(value.to),
          }
        : null,
    );
    if (value) this.visibleDate.set(fromDay(value.from));
  }

  protected onMonth(month: TuiMonth): void {
    this.visibleDate.set(month.toLocalNativeDate());
  }
}
