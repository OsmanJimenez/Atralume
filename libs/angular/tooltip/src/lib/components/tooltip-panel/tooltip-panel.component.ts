import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "atr-tooltip-panel",
  standalone: true,
  templateUrl: "./tooltip-panel.component.html",
  styleUrl: "./tooltip-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-tooltip-panel", role: "tooltip", "[attr.id]": "id()" },
})
export class AtralumeTooltipPanel {
  readonly text = input.required<string>();
  readonly id = input.required<string>();
}
