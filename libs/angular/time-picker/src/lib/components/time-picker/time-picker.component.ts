import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  Injector,
  runInInjectionContext,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import {
  transformedValue,
  type ParseResult,
  type TransformedValueSignal,
} from "@angular/forms/signals";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  chevronDownIcon,
  closeIcon,
} from "@atralume/angular/icon";
import { AtralumePopover } from "@atralume/angular/popover";
import { AtralumeSelect } from "@atralume/angular/select";
export interface AtralumeTimeValue {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds?: number;
}
export type AtralumeTimeFormat = "12h" | "24h";
function total(value: AtralumeTimeValue): number {
  return value.hours * 3600 + value.minutes * 60 + (value.seconds ?? 0);
}
@Component({
  selector: "atr-time-picker",
  standalone: true,
  imports: [
    AtralumeFormField,
    AtralumeInput,
    AtralumeButton,
    AtralumeIconButton,
    AtralumeIcon,
    AtralumePopover,
    AtralumeSelect,
  ],
  templateUrl: "./time-picker.component.html",
  styleUrl: "./time-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideAtralumeIcons([chevronDownIcon, closeIcon]),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeTimePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeTimePicker),
      multi: true,
    },
  ],
  host: { class: "atr-time-picker" },
})
export class AtralumeTimePicker
  extends ɵAtralumeValueControl<AtralumeTimeValue>
  implements Validator, OnInit
{
  readonly opened = model(false);
  readonly format = input<AtralumeTimeFormat>("24h");
  readonly locale = input("en-US");
  readonly seconds = input(false, { transform: booleanAttribute });
  readonly step = input(60);
  readonly min = input<
    AtralumeTimeValue | null,
    AtralumeTimeValue | null | undefined
  >(null, { transform: (value) => value ?? null });
  readonly max = input<
    AtralumeTimeValue | null,
    AtralumeTimeValue | null | undefined
  >(null, { transform: (value) => value ?? null });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly hasSeconds = computed(
    () => this.seconds() || this.step() % 60 !== 0,
  );
  protected readonly hour = signal(0);
  protected readonly minute = signal(0);
  protected readonly second = signal(0);
  protected readonly period = signal<"AM" | "PM">("AM");
  rawValue!: TransformedValueSignal<string>;
  private readonly parserInjector = inject(Injector);
  ngOnInit(): void {
    runInInjectionContext(this.parserInjector, () => {
      this.rawValue = transformedValue(this.value, {
        parse: (value: string) => this.parse(value),
        format: (value) => this.formatValue(value),
      });
    });
  }

  protected readonly message = computed(
    () => this.error() || this.rawValue?.parseErrors()[0]?.message || null,
  );
  readonly hourOptions = computed(() =>
    Array.from({ length: this.format() === "12h" ? 12 : 24 }, (_, index) => {
      const value = this.format() === "12h" ? index + 1 : index;
      return {
        id: String(value),
        label: new Intl.NumberFormat(this.locale(), {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }).format(value),
        value,
      };
    }),
  );
  readonly minuteOptions = computed(() =>
    Array.from({ length: 60 }, (_, value) => ({
      id: String(value),
      label: new Intl.NumberFormat(this.locale(), {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }).format(value),
      value,
    })),
  );
  protected readonly periods = [
    { id: "AM", label: "AM", value: "AM" },
    { id: "PM", label: "PM", value: "PM" },
  ];
  readonly draft = computed<AtralumeTimeValue>(() => {
    let hours = this.hour();
    if (this.format() === "12h")
      hours = (hours % 12) + (this.period() === "PM" ? 12 : 0);
    return {
      hours,
      minutes: this.minute(),
      ...(this.hasSeconds() ? { seconds: this.second() } : {}),
    };
  });
  readonly draftInvalid = computed(() => !this.allowed(this.draft()));
  protected readonly toggleElement = viewChild<
    unknown,
    ElementRef<HTMLButtonElement>
  >("timeToggle", { read: ElementRef });
  private validatorChanged: () => void = () => undefined;
  constructor() {
    super();
    effect(() => {
      const opened = this.opened(),
        value = this.value(),
        format = this.format();
      if (opened)
        untracked(() => {
          this.hour.set(
            format === "12h"
              ? (value?.hours ?? 0) % 12 || 12
              : (value?.hours ?? 0),
          );
          this.minute.set(value?.minutes ?? 0);
          this.second.set(value?.seconds ?? 0);
          this.period.set((value?.hours ?? 0) >= 12 ? "PM" : "AM");
        });
    });
    effect(() => {
      this.value();
      this.min();
      this.max();
      this.step();
      this.required();
      this.rawValue?.parseErrors();
      untracked(() => this.validatorChanged());
    });
    effect(() => {
      if (this.blocked() || this.readonly()) this.opened.set(false);
    });
  }
  private allowed(value: AtralumeTimeValue): boolean {
    const seconds = value.seconds ?? 0;
    const step = this.step();
    if (!Number.isInteger(step) || step <= 0)
      throw new Error("Time step is a positive integer number of seconds.");
    const time = total(value),
      min = this.min(),
      max = this.max();
    return (
      Number.isInteger(value.hours) &&
      value.hours >= 0 &&
      value.hours < 24 &&
      Number.isInteger(value.minutes) &&
      value.minutes >= 0 &&
      value.minutes < 60 &&
      Number.isInteger(seconds) &&
      seconds >= 0 &&
      seconds < 60 &&
      (!min || time >= total(min)) &&
      (!max || time <= total(max)) &&
      (time - (min ? total(min) : 0)) % step === 0
    );
  }
  private parse(text: string): ParseResult<AtralumeTimeValue | null> {
    if (!text) return { value: null };
    const parts = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text);
    const value = parts
      ? {
          hours: Number(parts[1]),
          minutes: Number(parts[2]),
          ...(this.hasSeconds() ? { seconds: Number(parts[3] ?? 0) } : {}),
        }
      : null;
    return value && this.allowed(value)
      ? { value }
      : {
          value: null,
          error: { kind: "timeParse", message: "Enter an allowed time" },
        };
  }
  formatValue(value: AtralumeTimeValue | null): string {
    return value
      ? String(value.hours).padStart(2, "0") +
          ":" +
          String(value.minutes).padStart(2, "0") +
          (this.hasSeconds()
            ? ":" + String(value.seconds ?? 0).padStart(2, "0")
            : "")
      : "";
  }
  validate(): ValidationErrors | null {
    if (this.rawValue?.parseErrors().length) return { timeParse: true };
    const value = this.value();
    return value === null
      ? this.required()
        ? { required: true }
        : null
      : this.allowed(value)
        ? null
        : { timeInvalid: true };
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
  protected typed(event: Event): void {
    if (this.blocked() || this.readonly()) return;
    this.rawValue.set((event.target as HTMLInputElement).value);
    this.commit(this.value());
  }
  toggle(): void {
    if (!this.blocked() && !this.readonly())
      this.opened.update((value) => !value);
  }
  protected setHour(value: number | readonly number[] | null): void {
    if (typeof value === "number") this.hour.set(value);
  }
  protected setMinute(value: number | readonly number[] | null): void {
    if (typeof value === "number") this.minute.set(value);
  }
  protected setSecond(value: number | readonly number[] | null): void {
    if (typeof value === "number") this.second.set(value);
  }
  protected setPeriod(value: string | readonly string[] | null): void {
    if (value === "AM" || value === "PM") this.period.set(value);
  }
  save(): void {
    if (this.draftInvalid()) return;
    this.commit(this.draft());
    this.opened.set(false);
    this.focus();
  }
  clear(): void {
    this.commit(null);
    this.rawValue.set("");
    this.focus();
  }
}
