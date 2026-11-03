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
import { TuiTime } from "@taiga-ui/cdk/date-time";
import { TuiInputTime } from "@taiga-ui/kit";
import type { MaskitoTimeMode } from "@maskito/kit";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";

export interface AtralumeTimeValue {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds?: number;
}
export type AtralumeTimeFormat = "12h" | "24h";

function toTime(value: AtralumeTimeValue | null): TuiTime | null {
  return value
    ? new TuiTime(value.hours, value.minutes, value.seconds ?? 0)
    : null;
}

function fromTime(
  value: TuiTime | null,
  withSeconds: boolean,
): AtralumeTimeValue | null {
  return value
    ? {
        hours: value.hours,
        minutes: value.minutes,
        ...(withSeconds ? { seconds: value.seconds } : {}),
      }
    : null;
}

function sameTime(
  a: TuiTime | null,
  b: TuiTime | null,
  withSeconds: boolean,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    (!withSeconds || a.seconds === b.seconds)
  );
}

/**
 * Thin time picker over Taiga `tuiInputTime`.
 * Public value stays `AtralumeTimeValue`; inner FormControl holds `TuiTime`.
 */
@Component({
  selector: "atr-time-picker",
  standalone: true,
  imports: [ReactiveFormsModule, AtralumeFormField, TuiInputTime],
  templateUrl: "./time-picker.component.html",
  styleUrl: "./time-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
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
  implements Validator
{
  readonly format = input<AtralumeTimeFormat>("24h");
  readonly seconds = input(false, { transform: booleanAttribute });
  readonly step = input(60);
  readonly min = input<AtralumeTimeValue | null>(null);
  readonly max = input<AtralumeTimeValue | null>(null);
  readonly clearable = input(false, { transform: booleanAttribute });

  readonly hasSeconds = computed(
    () => this.seconds() || this.step() % 60 !== 0,
  );

  protected readonly mode = computed<MaskitoTimeMode>(() => {
    if (this.hasSeconds()) {
      return this.format() === "12h" ? "HH:MM:SS AA" : "HH:MM:SS";
    }
    return this.format() === "12h" ? "HH:MM AA" : "HH:MM";
  });

  protected readonly inner = new FormControl<TuiTime | null>(null);
  private validatorChanged: () => void = () => undefined;

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const sub = this.inner.valueChanges.subscribe((time) => {
      this.commit(fromTime(time, this.hasSeconds()));
    });
    destroyRef.onDestroy(() => sub.unsubscribe());
    effect(() => {
      const next = toTime(this.value());
      const withSeconds = this.hasSeconds();
      untracked(() => {
        if (!sameTime(this.inner.value, next, withSeconds)) {
          this.inner.setValue(next, { emitEvent: false });
        }
      });
    });
    effect(() => {
      if (this.blocked()) this.inner.disable({ emitEvent: false });
      else this.inner.enable({ emitEvent: false });
    });
    effect(() => {
      this.value();
      this.min();
      this.max();
      this.step();
      this.required();
      untracked(() => this.validatorChanged());
    });
  }

  validate(): ValidationErrors | null {
    const value = this.value();
    return value === null
      ? this.required()
        ? { required: true }
        : null
      : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
}
