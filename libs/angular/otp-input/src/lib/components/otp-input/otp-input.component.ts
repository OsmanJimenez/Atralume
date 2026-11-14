import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  untracked,
} from "@angular/core";
import {
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  type ValidationErrors,
  type Validator,
} from "@angular/forms";
import { TuiInputPin } from "@taiga-ui/kit";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";

function toInner(value: string | null): string {
  return value ?? "";
}

function fromInner(value: string | null): string | null {
  return value ? value : null;
}

/**
 * Composition over Taiga UI `TuiInputPin` inside Form Field / textfield chrome.
 * Public value is `string | null`; incomplete codes emit `otpIncomplete`.
 */
@Component({
  selector: "atr-otp-input",
  standalone: true,
  imports: [ReactiveFormsModule, AtralumeFormField, TuiInputPin],
  templateUrl: "./otp-input.component.html",
  styleUrl: "./otp-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeOtpInput),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeOtpInput),
      multi: true,
    },
  ],
  host: { class: "atr-otp-input" },
})
export class AtralumeOtpInput
  extends ɵAtralumeValueControl<string>
  implements Validator
{
  readonly length = input(4, {
    transform: (value: number | undefined) => value ?? 4,
  });

  protected readonly placeholderMask = computed(() =>
    "·".repeat(Math.max(0, this.length())),
  );

  protected readonly inner = new FormControl<string>("", { nonNullable: true });
  private validatorChanged: () => void = () => undefined;

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const sub = this.inner.valueChanges.subscribe((value) => {
      this.commit(fromInner(value));
    });
    destroyRef.onDestroy(() => sub.unsubscribe());
    effect(() => {
      const next = toInner(this.value());
      untracked(() => {
        if (this.inner.value !== next) {
          this.inner.setValue(next, { emitEvent: false });
        }
      });
    });
    effect(() => {
      const blocked = this.blocked();
      untracked(() => {
        if (blocked) this.inner.disable({ emitEvent: false });
        else this.inner.enable({ emitEvent: false });
      });
    });
    effect(() => {
      this.value();
      this.length();
      this.required();
      untracked(() => this.validatorChanged());
    });
  }

  validate(): ValidationErrors | null {
    const text = this.value() ?? "";
    if (!text) return this.required() ? { required: true } : null;
    return text.length < this.length() ? { otpIncomplete: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
}
