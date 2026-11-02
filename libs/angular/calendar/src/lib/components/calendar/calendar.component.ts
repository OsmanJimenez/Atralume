import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  arrowRightIcon,
} from "@atralume/angular/icon";
import { AtralumeDateAdapter, type AtralumeDateRange } from "../../adapters/date-adapter";
@Component({
  selector: "atr-calendar",
  standalone: true,
  imports: [AtralumeButton, AtralumeIconButton, AtralumeIcon],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideAtralumeIcons([arrowRightIcon])],
  host: { class: "atr-calendar", "(keydown)": "key($event)" },
})
export class AtralumeCalendar<D> {
  readonly adapter = inject(AtralumeDateAdapter) as AtralumeDateAdapter<D>;
  readonly label = input("Choose date");
  readonly locale = input(this.adapter.locale);
  readonly value = model<D | null>(null);
  readonly rangeValue = model<AtralumeDateRange<D> | null>(null);
  readonly selectionMode = input<"single" | "range">("single");
  readonly visibleDate = model<D | null>(null);
  readonly today = input(this.adapter.today());
  readonly min = input<D | null>(null);
  readonly max = input<D | null>(null);
  readonly dateFilter = input<(value: D) => boolean>(() => true);
  readonly firstDayOfWeek = input<number | null>(null);
  readonly showAdjacentDays = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  private readonly focusDate = signal<D | null>(null);
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  readonly visible = computed(
    () =>
      [
        this.visibleDate(),
        this.value(),
        this.rangeValue()?.start,
        this.today(),
      ].find((date): date is D => !!date && this.adapter.isValid(date)) ??
      this.adapter.today(),
  );
  readonly monthLabel = computed(() =>
    this.adapter.format(this.visible(), "month-year", this.locale()),
  );
  readonly monthNames = computed(() =>
    Array.from({ length: 12 }, (_, month) => ({
      month,
      label: this.adapter.format(
        this.adapter.create(this.adapter.year(this.visible()), month, 1),
        "month-year",
        this.locale(),
      ),
    })),
  );
  readonly years = computed(() =>
    Array.from(
      { length: 201 },
      (_, index) => this.adapter.year(this.visible()) - 100 + index,
    ),
  );
  readonly weekStart = computed(() => {
    const day =
      this.firstDayOfWeek() ?? this.adapter.firstDayOfWeek(this.locale());
    if (!Number.isInteger(day) || day < 0 || day > 6)
      throw new Error("firstDayOfWeek must be 0..6.");
    return day;
  });
  readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) =>
      this.adapter.weekdayName((this.weekStart() + index) % 7, this.locale()),
    ),
  );
  readonly weeks = computed(() => {
    const current = this.visible();
    const start = this.adapter.create(
      this.adapter.year(current),
      this.adapter.month(current),
      1,
    );
    const offset = (this.adapter.weekday(start) - this.weekStart() + 7) % 7;
    const days = Array.from({ length: 42 }, (_, index) => {
      const date = this.adapter.addDays(start, index - offset);
      return {
        date,
        id: this.keyFor(date),
        day: this.adapter.day(date),
        adjacent: this.adapter.month(date) !== this.adapter.month(current),
      };
    });
    return Array.from({ length: 6 }, (_, index) =>
      days.slice(index * 7, index * 7 + 7),
    );
  });
  readonly focusedId = computed(() => {
    const date =
      this.focusDate() ??
      this.value() ??
      this.rangeValue()?.start ??
      this.today();
    const days = this.weeks().flat();
    return (
      days.find(
        (cell) =>
          this.adapter.compare(cell.date, date) === 0 &&
          !this.unavailable(cell.date),
      )?.id ??
      days.find(
        (cell) =>
          (this.showAdjacentDays() || !cell.adjacent) &&
          !this.unavailable(cell.date),
      )?.id ??
      null
    );
  });
  keyFor(date: D): string {
    return this.adapter.serialize(date);
  }
  unavailable(date: D): boolean {
    const min = this.min(),
      max = this.max();
    return (
      this.disabled() ||
      !this.adapter.isValid(date) ||
      (!!min && this.adapter.compare(date, min) < 0) ||
      (!!max && this.adapter.compare(date, max) > 0) ||
      !this.dateFilter()(date)
    );
  }
  selected(date: D): boolean {
    const value = this.value(),
      range = this.rangeValue();
    return this.selectionMode() === "single"
      ? !!value && this.adapter.compare(value, date) === 0
      : !!range?.start &&
          this.adapter.compare(date, range.start) >= 0 &&
          (!range.end
            ? this.adapter.compare(date, range.start) === 0
            : this.adapter.compare(date, range.end) <= 0);
  }
  isToday(date: D): boolean {
    return this.adapter.compare(date, this.today()) === 0;
  }
  fullLabel(date: D): string {
    return this.adapter.format(date, "full", this.locale());
  }
  select(date: D): void {
    if (this.unavailable(date) || this.readonly()) return;
    this.focusDate.set(date);
    if (this.selectionMode() === "single") this.value.set(date);
    else {
      const range = this.rangeValue();
      this.rangeValue.set(
        !range?.start || range.end
          ? { start: date, end: null }
          : this.adapter.compare(date, range.start) < 0
            ? { start: date, end: range.start }
            : { start: range.start, end: date },
      );
    }
  }
  navigate(months: number): void {
    this.visibleDate.set(this.adapter.addMonths(this.visible(), months));
  }
  protected changeMonth(event: Event): void {
    this.visibleDate.set(
      this.adapter.create(
        this.adapter.year(this.visible()),
        Number((event.target as HTMLSelectElement).value),
        1,
      ),
    );
  }
  protected changeYear(event: Event): void {
    this.visibleDate.set(
      this.adapter.create(
        Number((event.target as HTMLSelectElement).value),
        this.adapter.month(this.visible()),
        1,
      ),
    );
  }
  protected focused(date: D): void {
    this.focusDate.set(date);
  }
  focus(): void {
    this.element
      .querySelector<HTMLElement>(
        '[data-calendar-date="' + this.focusedId() + '"]',
      )
      ?.focus();
  }
  protected key(event: KeyboardEvent): void {
    if (
      !(event.target as HTMLElement).hasAttribute("data-calendar-date") ||
      this.disabled()
    )
      return;
    const source = this.focusDate() ?? this.value() ?? this.today();
    let target: D;
    let direction = 1;
    const rtl = this.element.matches(":dir(rtl)");
    switch (event.key) {
      case "ArrowRight":
        direction = rtl ? -1 : 1;
        target = this.adapter.addDays(source, direction);
        break;
      case "ArrowLeft":
        direction = rtl ? 1 : -1;
        target = this.adapter.addDays(source, direction);
        break;
      case "ArrowDown":
        target = this.adapter.addDays(source, 7);
        break;
      case "ArrowUp":
        direction = -1;
        target = this.adapter.addDays(source, -7);
        break;
      case "Home":
        direction = 1;
        target = this.adapter.addDays(
          source,
          -((this.adapter.weekday(source) - this.weekStart() + 7) % 7),
        );
        break;
      case "End":
        direction = -1;
        target = this.adapter.addDays(
          source,
          6 - ((this.adapter.weekday(source) - this.weekStart() + 7) % 7),
        );
        break;
      case "PageUp":
        direction = -1;
        target = event.shiftKey
          ? this.adapter.addYears(source, -1)
          : this.adapter.addMonths(source, -1);
        break;
      case "PageDown":
        target = event.shiftKey
          ? this.adapter.addYears(source, 1)
          : this.adapter.addMonths(source, 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    let attempts = 0;
    while (this.unavailable(target) && attempts++ < 366)
      target = this.adapter.addDays(target, direction);
    if (this.unavailable(target)) return;
    this.focusDate.set(target);
    if (
      this.adapter.month(target) !== this.adapter.month(this.visible()) ||
      this.adapter.year(target) !== this.adapter.year(this.visible())
    )
      this.visibleDate.set(target);
    afterNextRender(() => this.focus(), { injector: this.injector });
  }
}
