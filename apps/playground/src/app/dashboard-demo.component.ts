import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  menuIcon,
  userIcon,
} from "@osmanjimenez/atralume/icon";
import { AtralumeIconButton } from "@osmanjimenez/atralume/icon-button";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
import { AtralumeBadge } from "@osmanjimenez/atralume/badge";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
} from "@osmanjimenez/atralume/card";
import { AtralumeChip, AtralumeChipSet } from "@osmanjimenez/atralume/chip";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
} from "@osmanjimenez/atralume/list";
import { TuiAccordion } from "@taiga-ui/kit";
import { AtralumeSkeleton } from "@osmanjimenez/atralume/skeleton";
import { AtralumeTooltip } from "@osmanjimenez/atralume/tooltip";
import {
  AtralumeMenu,
  AtralumeMenuTrigger,
  AtralumeMenuItem,
} from "@osmanjimenez/atralume/menu";
import {
  AtralumeDialog,
  AtralumeDialogTitle,
  AtralumeDialogContent,
  AtralumeDialogActions,
  AtralumeDialogClose,
} from "@osmanjimenez/atralume/dialog";
import { AtralumeSnackbar } from "@osmanjimenez/atralume/snackbar";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "@osmanjimenez/atralume/tabs";
import { AtralumePagination } from "@osmanjimenez/atralume/pagination";
import {
  AtralumeNavigationBar,
  AtralumeNavigationItem,
} from "@osmanjimenez/atralume/navigation-bar";
import { AtralumeFab } from "@osmanjimenez/atralume/fab";
import {
  AtralumeSpeedDial,
  AtralumeSpeedDialAction,
} from "@osmanjimenez/atralume/speed-dial";
import { AtralumeFormField } from "@osmanjimenez/atralume/form-field";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@osmanjimenez/atralume/input";
import { FormsDemo } from "./forms-demo.component";
@Component({
  selector: "atr-dashboard-demo",
  imports: [
    ReactiveFormsModule,
    AtralumeButton,
    AtralumeIcon,
    AtralumeIconButton,
    AtralumeAvatar,
    AtralumeBadge,
    AtralumeCard,
    AtralumeCardHeader,
    AtralumeCardContent,
    AtralumeCardActions,
    AtralumeChip,
    AtralumeChipSet,
    AtralumeList,
    AtralumeListItem,
    AtralumeListHeadline,
    AtralumeListSupporting,
    TuiAccordion,
    AtralumeSkeleton,
    AtralumeTooltip,
    AtralumeMenu,
    AtralumeMenuTrigger,
    AtralumeMenuItem,
    AtralumeDialogTitle,
    AtralumeDialogContent,
    AtralumeDialogActions,
    AtralumeDialogClose,
    AtralumeTabs,
    AtralumeTabList,
    AtralumeTab,
    AtralumeTabPanel,
    AtralumePagination,
    AtralumeNavigationBar,
    AtralumeNavigationItem,
    AtralumeFab,
    AtralumeSpeedDial,
    AtralumeSpeedDialAction,
    AtralumeFormField,
    TuiTextfield,
    AtralumeInput,
    FormsDemo,
  ],
  providers: [provideAtralumeIcons([checkIcon, menuIcon, userIcon])],
  templateUrl: "./dashboard-demo.component.html",
  styleUrl: "./dashboard-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDemo {
  protected readonly name = signal("Alex Morgan");
  protected readonly page = signal(1);
  protected readonly loading = signal(false);
  protected readonly filters = signal<readonly string[]>([]);
  protected readonly result = signal("Ready");
  readonly displayName = new FormControl("Alex Morgan", { nonNullable: true });
  private readonly dialog = inject(AtralumeDialog);
  private readonly snackbar = inject(AtralumeSnackbar);
  private readonly owner = inject(DestroyRef);
  private readonly views = inject(ViewContainerRef);
  protected toggleLoading(): void {
    this.loading.update((value) => !value);
  }
  protected openProfile(template: TemplateRef<unknown>, event: Event): void {
    const origin = event.currentTarget as HTMLElement;
    this.displayName.setValue(this.name());
    this.dialog
      .open<unknown, unknown, string>(template, {
        origin,
        owner: this.owner,
        viewContainerRef: this.views,
        labelledBy: "dashboard-profile-title",
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((result) => {
        if (result === "saved") {
          this.name.set(this.displayName.getRawValue());
          this.notify("Profile updated");
        }
      });
  }
  protected notify(message: string, event?: Event): void {
    const origin = event?.currentTarget as HTMLElement | undefined;
    this.snackbar
      .open({
        message,
        action: "Undo",
        dismissLabel: "Dismiss notification",
        origin,
        owner: this.owner,
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((result) => this.result.set(result));
  }
}
