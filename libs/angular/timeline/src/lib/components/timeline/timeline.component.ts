import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TuiTimelineComponent } from "@taiga-ui/kit";

export type AtralumeTimelineOrientation = "horizontal" | "vertical";

/**
 * Brand host for Taiga UI `TuiTimelineComponent`.
 * Extends the Taiga host (instead of nesting it) so projected
 * `label[tuiTimelineItem]` can `inject(TuiTimelineComponent)`.
 */
@Component({
  selector: "atr-timeline",
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: TuiTimelineComponent, useExisting: AtralumeTimeline },
  ],
  host: {
    class: "atr-timeline",
    "[attr.data-orientation]": "orientation()",
  },
})
export class AtralumeTimeline extends TuiTimelineComponent {}
