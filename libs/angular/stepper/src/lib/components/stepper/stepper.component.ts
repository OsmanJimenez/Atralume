import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChildren,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { FocusKeyManager } from "@angular/cdk/a11y";
import { AtralumeButton } from "@atralume/angular/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  warningIcon,
} from "@atralume/angular/icon";
import { AtralumeStep } from "../step/step.component";
import { STEPPER_CONTEXT } from "../../internal/stepper-context";
export interface AtralumeStepChange {
  readonly previous: number;
  readonly current: number;
}
@Component({
  selector: "atr-stepper",
  standalone: true,
  imports: [NgTemplateOutlet, AtralumeButton, AtralumeIcon],
  templateUrl: "./stepper.component.html",
  styleUrl: "./stepper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideAtralumeIcons([checkIcon, warningIcon]),
    {
      provide: STEPPER_CONTEXT,
      useExisting: forwardRef(() => AtralumeStepper),
    },
  ],
  host: {
    class: "atr-stepper",
    "[attr.data-orientation]": "orientation()",
    "(keydown)": "key($event)",
  },
})
export class AtralumeStepper {
  readonly label = input.required<string>();
  readonly selected = model(0);
  readonly linear = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  readonly stepChange = output<AtralumeStepChange>();
  private readonly projected = contentChildren(AtralumeStep, {
    descendants: true,
  });
  readonly steps = computed(() => {
    const steps = this.projected().filter((step) => step.belongsTo(this));
    const ids = steps.map((step) => step.stepId());
    if (new Set(ids).size !== ids.length)
      throw new Error("Stepper IDs must be unique.");
    return steps;
  });
  readonly activeIndex = computed(() => {
    const steps = this.steps();
    const requested = Math.max(0, Math.min(steps.length - 1, this.selected()));
    return steps[requested] && !steps[requested].disabled()
      ? requested
      : steps.findIndex((step) => !step.disabled());
  });
  readonly activeStep = computed(
    () => this.steps()[this.activeIndex()] ?? null,
  );
  readonly canNext = computed(() => this.canActivate(this.activeIndex() + 1));
  readonly canPrevious = computed(() =>
    this.canActivate(this.activeIndex() - 1),
  );
  readonly focusedHeader = signal<number | null>(null);
  private readonly headers = viewChildren<
    unknown,
    ElementRef<HTMLButtonElement>
  >("header", { read: ElementRef });
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private manager: FocusKeyManager<{
    disabled: boolean;
    focus(): void;
  }> | null = null;
  constructor() {
    effect((onCleanup) => {
      const headers = this.headers(),
        steps = this.steps();
      const managed = headers.map((element, index) => ({
        disabled: !this.canActivate(index),
        focus: () => element.nativeElement.focus(),
        getLabel: () => steps[index]?.label() ?? "",
      }));
      const orientation = this.orientation();
      const manager = new FocusKeyManager(managed)
        .withWrap()
        .withHomeAndEnd()
        .withVerticalOrientation(orientation === "vertical")
        .withHorizontalOrientation(
          orientation === "horizontal"
            ? this.element.matches(":dir(rtl)")
              ? "rtl"
              : "ltr"
            : null,
        );
      this.manager = manager;
      manager.updateActiveItem(this.activeIndex());
      onCleanup(() => {
        manager.destroy();
        if (this.manager === manager) this.manager = null;
      });
    });
  }
  canActivate(index: number): boolean {
    const steps = this.steps(),
      target = steps[index];
    if (this.disabled() || !target || target.disabled()) return false;
    if (index < this.activeIndex() && !target.editable()) return false;
    if (this.linear() && index > this.activeIndex())
      return steps
        .slice(0, index)
        .every(
          (step) =>
            step.optional() ||
            (!step.state().pending &&
              (step.control() ? step.state().valid : step.isComplete())),
        );
    return true;
  }
  activate(index: number): void {
    if (!this.canActivate(index)) return;
    const previous = this.activeIndex();
    if (index === previous) return;
    this.selected.set(index);
    this.stepChange.emit({ previous, current: index });
    afterNextRender(
      () =>
        this.element.querySelector<HTMLElement>(".atr-step-content")?.focus(),
      { injector: this.injector },
    );
  }
  next(): void {
    this.activate(this.activeIndex() + 1);
  }
  previous(): void {
    this.activate(this.activeIndex() - 1);
  }
  reset(): void {
    for (const step of this.steps()) step.control()?.reset();
    this.selected.set(0);
  }
  protected key(event: KeyboardEvent): void {
    if ((event.target as HTMLElement).hasAttribute("data-step-header"))
      this.manager?.onKeydown(event);
  }
  protected focusHeader(index: number): void {
    this.focusedHeader.set(index);
    this.manager?.updateActiveItem(index);
  }
}
