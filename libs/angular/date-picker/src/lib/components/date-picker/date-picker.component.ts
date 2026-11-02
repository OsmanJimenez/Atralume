import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  Injector,
  runInInjectionContext,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
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
import {
  AtralumeDialog,
  type AtralumeDialogRef,
} from "@atralume/angular/dialog";
import {
  AtralumeCalendar,
  AtralumeDateAdapter,
  type AtralumeDateRange,
} from "@atralume/angular/calendar";
export type AtralumeDatePickerValue<D> = D | AtralumeDateRange<D>;
@Component({
  selector: "atr-date-picker",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    AtralumeFormField,
    AtralumeInput,
    AtralumeButton,
    AtralumeIconButton,
    AtralumeIcon,
    AtralumePopover,
    AtralumeCalendar,
  ],
  templateUrl: "./date-picker.component.html",
  styleUrl: "./date-picker.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideAtralumeIcons([chevronDownIcon, closeIcon]),
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
export class AtralumeDatePicker<D>
  extends ɵAtralumeValueControl<AtralumeDatePickerValue<D>>
  implements Validator, OnInit
{
  readonly adapter = inject(AtralumeDateAdapter) as AtralumeDateAdapter<D>;
  readonly selectionMode = input<"single" | "range">("single");
  readonly opened = model(false);
  readonly visibleDate = model<D | null>(null);
  readonly min = input<D | null>(null);
  readonly max = input<D | null>(null);
  readonly dateFilter = input<(value: D) => boolean>(() => true);
  readonly locale = input(this.adapter.locale);
  readonly readonlyInput = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly presentation = input<"popover" | "dialog">("popover");
  readonly singleValue = computed(() =>
    this.selectionMode() === "single" ? (this.value() as D | null) : null,
  );
  readonly rangeValue = computed(() =>
    this.selectionMode() === "range"
      ? (this.value() as AtralumeDateRange<D> | null)
      : null,
  );
  rawValue!: TransformedValueSignal<string>;
  private readonly parserInjector = inject(Injector);
  ngOnInit(): void {
    runInInjectionContext(this.parserInjector, () => {
      this.rawValue = transformedValue(this.value, {
        parse: (text: string) => this.parse(text),
        format: (value) => this.format(value),
      });
    });
  }

  protected readonly message = computed(
    () => this.error() || this.rawValue?.parseErrors()[0]?.message || null,
  );
  protected readonly toggleElement = viewChild<
    unknown,
    ElementRef<HTMLButtonElement>
  >("calendarToggle", { read: ElementRef });
  private readonly content =
    viewChild.required<TemplateRef<unknown>>("calendarContent");
  private readonly dialog = inject(AtralumeDialog);
  private readonly owner = inject(DestroyRef);
  private readonly views = inject(ViewContainerRef);
  private dialogRef: AtralumeDialogRef<unknown> | null = null;
  private validatorChanged: () => void = () => undefined;
  constructor() {
    super();
    effect(() => {
      this.value();
      this.min();
      this.max();
      this.dateFilter();
      this.required();
      this.rawValue?.parseErrors();
      untracked(() => this.validatorChanged());
    });
    effect((onCleanup) => {
      const opened = this.opened(),
        presentation = this.presentation(),
        origin = this.toggleElement();
      this.content();
      if (!opened || presentation !== "dialog" || !origin || this.blocked())
        return;
      const ref = untracked(() =>
        this.dialog.open(this.content(), {
          origin: origin.nativeElement,
          label: this.label() + " calendar",
          owner: this.owner,
          viewContainerRef: this.views,
        }),
      );
      this.dialogRef = ref;
      const sub = ref.afterClosed.subscribe(() => {
        if (this.dialogRef === ref) {
          this.dialogRef = null;
          this.opened.set(false);
        }
      });
      onCleanup(() => {
        sub.unsubscribe();
        if (this.dialogRef === ref) this.dialogRef = null;
        ref.close();
      });
    });
    effect(() => {
      if (this.blocked() || this.readonly()) this.opened.set(false);
    });
  }
  private valid(date: D): boolean {
    const min = this.min(),
      max = this.max();
    return (
      this.adapter.isValid(date) &&
      (!min || this.adapter.compare(date, min) >= 0) &&
      (!max || this.adapter.compare(date, max) <= 0) &&
      this.dateFilter()(date)
    );
  }
  private parse(text: string): ParseResult<AtralumeDatePickerValue<D> | null> {
    if (!text.trim()) return { value: null };
    if (this.selectionMode() === "single") {
      const date = this.adapter.parse(text, this.locale());
      return date && this.valid(date)
        ? { value: date }
        : {
            value: null,
            error: { kind: "dateParse", message: "Enter an allowed date" },
          };
    }
    const parts = text.split(" — ");
    const start = this.adapter.parse(parts[0] ?? "", this.locale()),
      end = this.adapter.parse(parts[1] ?? "", this.locale());
    return parts.length === 2 &&
      start &&
      end &&
      this.valid(start) &&
      this.valid(end) &&
      this.adapter.compare(start, end) <= 0
      ? { value: { start, end } }
      : {
          value: null,
          error: {
            kind: "dateRange",
            message: "Enter an allowed start and end date separated by —",
          },
        };
  }
  private format(value: AtralumeDatePickerValue<D> | null): string {
    if (!value) return "";
    if (this.selectionMode() === "single")
      return this.adapter.isValid(value)
        ? this.adapter.format(value, "input", this.locale())
        : "";
    const range = value as AtralumeDateRange<D>;
    return (
      (range.start && this.adapter.isValid(range.start)
        ? this.adapter.format(range.start, "input", this.locale())
        : "") +
      " — " +
      (range.end && this.adapter.isValid(range.end)
        ? this.adapter.format(range.end, "input", this.locale())
        : "")
    );
  }
  validate(): ValidationErrors | null {
    if (this.rawValue?.parseErrors().length) return { dateParse: true };
    const value = this.value();
    if (value === null) return this.required() ? { required: true } : null;
    if (this.selectionMode() === "single")
      return this.valid(value as D) ? null : { dateInvalid: true };
    const range = value as AtralumeDateRange<D>;
    return range.start &&
      range.end &&
      this.valid(range.start) &&
      this.valid(range.end) &&
      this.adapter.compare(range.start, range.end) <= 0
      ? null
      : { dateRange: true };
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
  protected typed(event: Event): void {
    if (this.blocked() || this.readonly() || this.readonlyInput()) return;
    this.rawValue.set((event.target as HTMLInputElement).value);
    this.commit(this.value());
  }
  toggle(): void {
    if (!this.blocked() && !this.readonly())
      this.opened.update((value) => !value);
  }
  close(): void {
    this.opened.set(false);
  }
  protected pick(value: D | null): void {
    if (this.selectionMode() !== "single") return;
    this.commit(value);
    if (value) {
      this.close();
      this.focus();
    }
  }
  protected pickRange(value: AtralumeDateRange<D> | null): void {
    if (this.selectionMode() !== "range") return;
    this.commit(value);
    if (value?.start && value.end) {
      this.close();
      this.focus();
    }
  }
  clear(): void {
    this.commit(null);
    this.rawValue.set("");
    this.focus();
  }
}
