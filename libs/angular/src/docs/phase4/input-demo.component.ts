import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  AtralumeCalendar,
  AtralumeNativeDateAdapter,
  type AtralumeDateRange,
} from "@atralume/angular/calendar";
import { AtralumeDatePicker } from "@atralume/angular/date-picker";
import {
  AtralumeTimePicker,
  type AtralumeTimeValue,
} from "@atralume/angular/time-picker";
import {
  AtralumeSlider,
  AtralumeRangeSlider,
  type AtralumeSliderRange,
} from "@atralume/angular/slider";
import {
  AtralumeFileUpload,
  type AtralumeUploadFileState,
} from "@atralume/angular/file-upload";
import {
  AtralumeStepper,
  AtralumeStep,
  AtralumeStepperNext,
  AtralumeStepperPrevious,
} from "@atralume/angular/stepper";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeFormField, TuiTextfield } from "@atralume/angular/form-field";
@Component({
  selector: "atr-advanced-input-demo",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AtralumeCalendar,
    AtralumeDatePicker,
    AtralumeTimePicker,
    AtralumeSlider,
    AtralumeRangeSlider,
    AtralumeFileUpload,
    AtralumeStepper,
    AtralumeStep,
    AtralumeStepperNext,
    AtralumeStepperPrevious,
    AtralumeButton,
    AtralumeInput,
    AtralumeFormField,
    TuiTextfield,
  ],
  templateUrl: "./input-demo.component.html",
  styleUrl: "./input-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedInputDemo {
  readonly family = input("date-picker");
  readonly disabled = input(false);
  readonly readOnly = input(false);
  readonly range = input(false);
  readonly vertical = input(false);
  readonly twelveHour = input(false);
  readonly seconds = input(false);
  readonly error = input(false);
  readonly uploading = input(false);
  readonly dialog = input(false);
  readonly previews = input(false);
  readonly adapter = new AtralumeNativeDateAdapter();
  readonly baseDate = this.adapter.create(2026, 10, 5);
  readonly result = signal("No action");
  readonly progress = signal(0);
  readonly dateControl = new FormControl<Date | AtralumeDateRange<Date> | null>(
    null,
  );
  readonly timeControl = new FormControl<AtralumeTimeValue | null>(null);
  readonly sliderControl = new FormControl<number | null>(50);
  readonly rangeControl = new FormControl<AtralumeSliderRange | null>({
    start: 20,
    end: 80,
  });
  readonly fileControl = new FormControl<readonly File[] | null>(null);
  readonly profile = new FormControl("", {
    nonNullable: true,
    validators: [Validators.required],
  });
  private readonly fileValues = toSignal(this.fileControl.valueChanges, {
    initialValue: null,
  });
  readonly fileStates = computed<readonly AtralumeUploadFileState[]>(() =>
    this.uploading()
      ? (this.fileValues() ?? []).map((file) => ({
          file,
          status: this.progress() < 100 ? "uploading" : "success",
          progress: this.progress(),
          cancellable: this.progress() < 100,
        }))
      : [],
  );
  constructor() {
    const owner = inject(DestroyRef);
    const subscriptions = [
      this.dateControl.valueChanges.subscribe((value) =>
        this.result.set(
          !value
            ? "null"
            : value instanceof Date
              ? this.adapter.serialize(value)
              : String(value.start && this.adapter.serialize(value.start)) +
                " — " +
                String(value.end && this.adapter.serialize(value.end)),
        ),
      ),
      this.timeControl.valueChanges.subscribe((value) =>
        this.result.set(JSON.stringify(value)),
      ),
      this.sliderControl.valueChanges.subscribe((value) =>
        this.result.set(String(value)),
      ),
      this.rangeControl.valueChanges.subscribe((value) =>
        this.result.set(JSON.stringify(value)),
      ),
      this.fileControl.valueChanges.subscribe((value) =>
        this.result.set((value?.length ?? 0) + " files"),
      ),
    ];
    owner.onDestroy(() =>
      subscriptions.forEach((subscription) => subscription.unsubscribe()),
    );
  }
  protected calendarChanged(value: Date | null): void {
    if (value) this.result.set(this.adapter.serialize(value));
  }
  protected rangeChanged(value: AtralumeDateRange<Date> | null): void {
    this.result.set(
      value?.start
        ? this.adapter.serialize(value.start) +
            (value.end ? " — " + this.adapter.serialize(value.end) : " — …")
        : "null",
    );
  }
  advance(): void {
    this.progress.update((value) => Math.min(100, value + 25));
  }
}
