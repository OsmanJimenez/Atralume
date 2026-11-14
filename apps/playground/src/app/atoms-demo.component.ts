import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  closeIcon,
  arrowRightIcon,
} from "@osmanjimenez/atralume/icon";
import { AtralumeIconButton } from "@osmanjimenez/atralume/icon-button";
import { AtralumeLink } from "@osmanjimenez/atralume/link";
import { AtralumeBadge } from "@osmanjimenez/atralume/badge";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
import { AtralumeDivider } from "@osmanjimenez/atralume/divider";
import {
  AtralumeProgressSpinner,
  AtralumeProgressBar,
} from "@osmanjimenez/atralume/progress";
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
