import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { TuiRating } from "@taiga-ui/kit";
import { ɵAtralumeValueControl } from "@osmanjimenez/atralume/internal/forms";

/** Maps Atralume null (unset) to Taiga rating fallback `0`. */
function toInner(value: number | null): number {
  return value ?? 0;
}

/** Maps Taiga `0` back to null for empty form values. */
function fromInner(value: number | null): number | null {
  return !value ? null : value;
}

/**
 * Composition over Taiga UI `TuiRating`.
 * Public value is `number | null`; inner FormControl uses Taiga's `0` fallback.
 */
@Component({
  selector: "atr-rating",
  standalone: true,
  imports: [ReactiveFormsModule, TuiRating],
  templateUrl: "./rating.component.html",
  styleUrl: "./rating.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeRating),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeRating),
      multi: true,
    },
  ],
  host: {
    class: "atr-rating",
    "[attr.aria-label]": "label()",
  },
})
export class AtralumeRating
  extends ɵAtralumeValueControl<number>
  implements Validator
{
  readonly max = input(5, {
    transform: (value: number | undefined) => value ?? 5,
  });

  protected readonly inner = new FormControl<number>(0, { nonNullable: true });
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
      const inactive = this.blocked() || this.readonly();
      untracked(() => {
        if (inactive) this.inner.disable({ emitEvent: false });
        else this.inner.enable({ emitEvent: false });
      });
    });
    effect(() => {
      this.value();
      this.max();
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
      : value < 1 || value > this.max()
        ? { ratingBounds: true }
        : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
}
