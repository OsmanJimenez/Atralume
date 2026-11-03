import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { ɵAtralumeControlIds } from "@atralume/angular";
import { STEPPER_CONTEXT } from "../../internal/stepper-context";

/**
 * Step slot for `AtralumeStepper`.
 * Header chrome is rendered as `button[tuiStep]`; projected content is a panel.
 */
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
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly stepState = input<"normal" | "pass" | "error">("normal");
  readonly icon = input("");
  readonly content = viewChild<TemplateRef<unknown>>("content");
  private readonly owner = inject(STEPPER_CONTEXT);

  belongsTo(owner: unknown): boolean {
    return this.owner === owner;
  }
}
