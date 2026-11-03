import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  untracked,
} from "@angular/core";
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import { TuiDay, TuiDayRange } from "@taiga-ui/cdk/date-time";
import { TuiInputDate, TuiInputDateRange } from "@taiga-ui/kit";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import type { AtralumeDateRange } from "@atralume/angular/calendar";

export type AtralumeDatePickerValue<D = Date> = D | AtralumeDateRange<D>;

function toDay(value: Date | null | undefined): TuiDay | null {
  return value ? TuiDay.fromLocalNativeDate(value) : null;
}

function fromDay(value: TuiDay | null): Date | null {
  return value ? value.toLocalNativeDate() : null;
}

/**
 * Thin date picker over Taiga `tuiInputDate` / `tuiInputDateRange`.
 * Public value stays `Date` / `{ start, end }`; inner FormControl holds CDK types.
 */
@Component({
  selector: "atr-date-picker",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AtralumeFormField,
    TuiInputDate,
    TuiInputDateRange,
  ],
  templateUrl: "./date-picker.component.html",
  styleUrl: "./date-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeDatePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeDatePicker),
      multi: true,
    },
  ],
  host: { class: "atr-date-picker" },
})
export class AtralumeDatePicker
  extends ɵAtralumeValueControl<AtralumeDatePickerValue<Date>>
  implements Validator
{
  readonly selectionMode = input<"single" | "range">("single");
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly dateFilter = input<(value: Date) => boolean>(() => true);
  readonly clearable = input(false, { transform: booleanAttribute });
  /** Kept for API compatibility; Taiga dropdown replaces popover/dialog. */
  readonly presentation = input<"popover" | "dialog">("popover");
  readonly visibleDate = input<Date | null>(null);

  protected readonly tuiMin = computed(
    () => toDay(this.min()) ?? undefined,
  );
  protected readonly tuiMax = computed(
    () => toDay(this.max()) ?? undefined,
  );
  protected readonly disabledItemHandler = computed(() => {
    const filter = this.dateFilter();
    return (day: TuiDay) => !filter(day.toLocalNativeDate());
  });

  protected readonly single = new FormControl<TuiDay | null>(null);
  protected readonly range = new FormControl<TuiDayRange | null>(null);

  private validatorChanged: () => void = () => undefined;

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const singleSub = this.single.valueChanges.subscribe((day) => {
      if (this.selectionMode() !== "single") return;
      this.commit(fromDay(day));
    });
    const rangeSub = this.range.valueChanges.subscribe((value) => {
      if (this.selectionMode() !== "range") return;
      this.commit(
        value
          ? { start: fromDay(value.from), end: fromDay(value.to) }
          : null,
      );
    });
    destroyRef.onDestroy(() => {
      singleSub.unsubscribe();
      rangeSub.unsubscribe();
    });
    effect(() => {
      const mode = this.selectionMode();
      const next = this.value();
      untracked(() => {
        if (mode === "single") {
          const day = toDay((next as Date | null) ?? null);
          if (!Object.is(this.single.value, day) && !(day && this.single.value?.daySame(day))) {
            this.single.setValue(day, { emitEvent: false });
          }
        } else {
          const rangeValue = next as AtralumeDateRange<Date> | null;
          const mapped =
            rangeValue?.start && rangeValue.end
              ? new TuiDayRange(
                  TuiDay.fromLocalNativeDate(rangeValue.start),
                  TuiDay.fromLocalNativeDate(rangeValue.end),
                )
              : null;
          const current = this.range.value;
          if (
            (!mapped && current) ||
            (mapped && (!current || !current.daySame(mapped)))
          ) {
            this.range.setValue(mapped, { emitEvent: false });
          }
        }
      });
    });
    effect(() => {
      const blocked = this.blocked();
      untracked(() => {
        if (blocked) {
          this.single.disable({ emitEvent: false });
          this.range.disable({ emitEvent: false });
        } else {
          this.single.enable({ emitEvent: false });
          this.range.enable({ emitEvent: false });
        }
      });
    });
    effect(() => {
      this.value();
      this.min();
      this.max();
      this.required();
      untracked(() => this.validatorChanged());
    });
  }

  validate(): ValidationErrors | null {
    const value = this.value();
    if (value === null) return this.required() ? { required: true } : null;
    if (this.selectionMode() === "single") {
      const date = value as Date;
      return date instanceof Date && !Number.isNaN(date.getTime())
        ? null
        : { dateInvalid: true };
    }
    const range = value as AtralumeDateRange<Date>;
    return range.start && range.end ? null : { dateRange: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
}
