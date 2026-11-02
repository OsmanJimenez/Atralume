import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import type { AbstractControl } from "@angular/forms";
import { ɵAtralumeControlIds } from "@atralume/angular";
import { STEPPER_CONTEXT } from "../../internal/stepper-context";
@Component({
  selector: "atr-step",
  standalone: true,
  templateUrl: "./step.component.html",
  styleUrl: "./step.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtralumeStep {
  readonly label = input.required<string>();
  readonly stepId = input<string>(inject(ɵAtralumeControlIds).create());
  readonly optional = input(false, { transform: booleanAttribute });
  readonly editable = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly completed = input<boolean | null>(null);
  readonly error = input<string | null>(null);
  readonly control = input<AbstractControl | null>(null);
  readonly content = viewChild<TemplateRef<unknown>>("content");
  readonly state = signal({
    valid: false,
    invalid: false,
    pending: false,
    interacted: false,
  });
  readonly isComplete = computed(() => this.completed() ?? this.state().valid);
  readonly hasError = computed(
    () => !!this.error() || (this.state().invalid && this.state().interacted),
  );
  private readonly owner = inject(STEPPER_CONTEXT);
  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      if (!control) {
        this.state.set({
          valid: false,
          invalid: false,
          pending: false,
          interacted: false,
        });
        return;
      }
      const update = () =>
        this.state.set({
          valid: control.valid,
          invalid: control.invalid,
          pending: control.pending,
          interacted: control.touched || control.dirty,
        });
      update();
      const subscription = control.events.subscribe(update);
      onCleanup(() => subscription.unsubscribe());
    });
  }
  belongsTo(owner: unknown): boolean {
    return this.owner === owner;
  }
}
