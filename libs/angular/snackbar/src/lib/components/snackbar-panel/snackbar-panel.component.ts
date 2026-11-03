import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  closeIcon,
} from "@atralume/angular/icon";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SNACKBAR_SESSION } from "../../models/snackbar.types";

/**
 * Action-capable snackbar body opened through `TuiNotificationService`.
 */
@Component({
  selector: "atr-snackbar-panel",
  standalone: true,
  imports: [AtralumeButton, AtralumeIconButton, AtralumeIcon],
  providers: [provideAtralumeIcons([closeIcon])],
  templateUrl: "./snackbar-panel.component.html",
  styleUrl: "./snackbar-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-snackbar-panel",
    "(pointerenter)": 'session.pause("hover")',
    "(pointerleave)": 'session.resume("hover")',
    "(focusin)": 'session.pause("focus")',
    "(focusout)": 'session.resume("focus")',
    "[attr.data-tone]": 'session.config.tone ?? "neutral"',
  },
})
export class AtralumeSnackbarPanel {
  protected readonly session = inject(SNACKBAR_SESSION);
}
