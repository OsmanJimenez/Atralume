import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { AtralumeIconRegistry } from "../../services/icon-registry";
import type { IconSize } from "../../models/icon.types";
@Component({
  selector: "atr-icon",
  standalone: true,
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-icon",
    "[attr.data-name]": "name()",
    "[attr.data-size]": "size()",
    "[attr.aria-hidden]": 'decorative() ? "true" : null',
    "[attr.role]": 'decorative() ? null : "img"',
    "[attr.aria-label]": "accessibleLabel()",
    "[class.atr-icon--rtl]": "definition()?.mirrorInRtl",
    "[style.--atr-icon-custom-size]": "pixelSize()",
  },
})
export class AtralumeIcon {
  readonly name = input.required<string>();
  readonly size = input<IconSize>("medium");
  readonly decorative = input(true, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  private readonly registry = inject(AtralumeIconRegistry);
  protected readonly definition = computed(() =>
    this.registry.get(this.name()),
  );
  protected readonly pixelSize = computed(() => {
    const value = this.size();
    return typeof value === "number" && Number.isFinite(value) && value > 0
      ? `${value}px`
      : null;
  });
  protected readonly accessibleLabel = computed(() => {
    if (this.decorative()) return null;
    const label = this.label()?.trim();
    if (!label) throw new Error("Informative atr-icon requires a label.");
    return label;
  });
}
