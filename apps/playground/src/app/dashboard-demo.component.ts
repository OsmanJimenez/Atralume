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
import { AtralumeButton } from "@atralume/angular/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  menuIcon,
  userIcon,
} from "@atralume/angular/icon";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { AtralumeBadge } from "@atralume/angular/badge";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
} from "@atralume/angular/card";
import { AtralumeChip, AtralumeChipSet } from "@atralume/angular/chip";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
} from "@atralume/angular/list";
import {
  AtralumeAccordion,
  AtralumeAccordionItem,
  AtralumeAccordionHeader,
} from "@atralume/angular/accordion";
import { AtralumeSkeleton } from "@atralume/angular/skeleton";
import { AtralumeTooltip } from "@atralume/angular/tooltip";
import {
  AtralumeMenu,
  AtralumeMenuTrigger,
  AtralumeMenuItem,
} from "@atralume/angular/menu";
import {
  AtralumeDialog,
  AtralumeDialogTitle,
  AtralumeDialogContent,
  AtralumeDialogActions,
  AtralumeDialogClose,
} from "@atralume/angular/dialog";
import { AtralumeSnackbar } from "@atralume/angular/snackbar";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "@atralume/angular/tabs";
import { AtralumePagination } from "@atralume/angular/pagination";
import {
  AtralumeNavigationBar,
  AtralumeNavigationItem,
} from "@atralume/angular/navigation-bar";
import { AtralumeFab } from "@atralume/angular/fab";
import {
  AtralumeSpeedDial,
  AtralumeSpeedDialAction,
} from "@atralume/angular/speed-dial";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
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
    AtralumeAccordion,
    AtralumeAccordionItem,
    AtralumeAccordionHeader,
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
