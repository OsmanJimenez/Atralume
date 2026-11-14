import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { TuiAvatarStack } from "@taiga-ui/kit";

export type AvatarGroupDirection = "start" | "end";

/** Adapter over Taiga UI `TuiAvatarStack` for stacked `atr-avatar` children. */
@Component({
  selector: "atr-avatar-group",
  standalone: true,
  imports: [TuiAvatarStack],
  templateUrl: "./avatar-group.component.html",
  styleUrl: "./avatar-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "atr-avatar-group",
  },
})
export class AtralumeAvatarGroup {
  readonly direction = input<AvatarGroupDirection>("end");
}
