import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { TuiStepper } from "@taiga-ui/kit";
import { AtralumeStep } from "../step/step.component";
import { STEPPER_CONTEXT } from "../../internal/stepper-context";

export interface AtralumeStepChange {
  readonly previous: number;
  readonly current: number;
}

/**
 * Thin stepper recipe over Taiga `tui-stepper` + `button[tuiStep]`.
 * Consumers gate Next themselves; no linear/`AbstractControl` engine.
 */
@Component({
  selector: "atr-stepper",
  standalone: true,
  imports: [NgTemplateOutlet, TuiStepper],
  templateUrl: "./stepper.component.html",
  styleUrl: "./stepper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: STEPPER_CONTEXT,
      useExisting: forwardRef(() => AtralumeStepper),
    },
  ],
  host: {
    class: "atr-stepper",
    "[attr.data-orientation]": "orientation()",
  },
})
export class AtralumeStepper {
  readonly label = input.required<string>();
  readonly selected = model(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly stepChange = output<AtralumeStepChange>();

  private readonly projected = contentChildren(AtralumeStep, {
    descendants: true,
  });
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);

  readonly steps = computed(() => {
    const steps = this.projected().filter((step) => step.belongsTo(this));
    const ids = steps.map((step) => step.stepId());
    if (new Set(ids).size !== ids.length)
      throw new Error("Stepper IDs must be unique.");
    return steps;
  });

  readonly activeIndex = computed(() => {
    const steps = this.steps();
    if (!steps.length) return 0;
    const requested = Math.max(0, Math.min(steps.length - 1, this.selected()));
    return steps[requested] && !steps[requested].disabled()
      ? requested
      : Math.max(
          0,
          steps.findIndex((step) => !step.disabled()),
        );
  });

  readonly activeStep = computed(
    () => this.steps()[this.activeIndex()] ?? null,
  );

  readonly canNext = computed(
    () =>
      !this.disabled() &&
      this.activeIndex() < this.steps().length - 1 &&
      !!this.steps()[this.activeIndex() + 1] &&
      !this.steps()[this.activeIndex() + 1].disabled(),
  );

  readonly canPrevious = computed(
    () =>
      !this.disabled() &&
      this.activeIndex() > 0 &&
      !!this.steps()[this.activeIndex() - 1] &&
      !this.steps()[this.activeIndex() - 1].disabled(),
  );

  activate(index: number): void {
    const steps = this.steps();
    const target = steps[index];
    if (this.disabled() || !target || target.disabled()) return;
    const previous = this.activeIndex();
    if (index === previous) return;
    this.selected.set(index);
    this.stepChange.emit({ previous, current: index });
    afterNextRender(
      () =>
        this.element
          .querySelector<HTMLElement>(".atr-step-content")
          ?.focus({ preventScroll: true }),
      { injector: this.injector },
    );
  }

  next(): void {
    if (this.canNext()) this.activate(this.activeIndex() + 1);
  }

  previous(): void {
    if (this.canPrevious()) this.activate(this.activeIndex() - 1);
  }

  reset(): void {
    this.selected.set(0);
  }

  protected onIndex(index: number): void {
    this.activate(index);
  }
}
