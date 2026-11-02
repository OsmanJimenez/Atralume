import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AtralumeButton } from "@atralume/angular/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  closeIcon,
  arrowRightIcon,
} from "@atralume/angular/icon";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import { AtralumeLink } from "@atralume/angular/link";
import { AtralumeBadge } from "@atralume/angular/badge";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { AtralumeDivider } from "@atralume/angular/divider";
import {
  AtralumeProgressSpinner,
  AtralumeProgressBar,
} from "@atralume/angular/progress";
@Component({
  selector: "atr-atoms-demo",
  imports: [
    AtralumeButton,
    AtralumeIcon,
    AtralumeIconButton,
    AtralumeLink,
    AtralumeBadge,
    AtralumeAvatar,
    AtralumeDivider,
    AtralumeProgressSpinner,
    AtralumeProgressBar,
  ],
  providers: [provideAtralumeIcons([checkIcon, closeIcon, arrowRightIcon])],
  templateUrl: "./atoms-demo.component.html",
  styleUrl: "./atoms-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomsDemo {
  protected readonly progress = signal<number | null>(null);
  protected advance(): void {
    this.progress.update((value) =>
      value === null ? 0 : value >= 100 ? null : value + 25,
    );
  }
}
