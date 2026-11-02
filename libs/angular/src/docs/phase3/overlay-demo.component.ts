import { AtralumeButton } from "@atralume/angular/button";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  inject,
  signal,
  input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AtralumeTooltip } from "@atralume/angular/tooltip";
import {
  AtralumeMenu,
  AtralumeMenuTrigger,
  AtralumeMenuItem,
  AtralumeMenuCheckboxItem,
  AtralumeMenuRadioItem,
  AtralumeMenuGroup,
  AtralumeMenuSeparator,
} from "@atralume/angular/menu";
import {
  AtralumeDialog,
  AtralumeDialogTitle,
  AtralumeDialogContent,
  AtralumeDialogActions,
  AtralumeDialogClose,
} from "@atralume/angular/dialog";
import {
  AtralumeBottomSheet,
  AtralumeBottomSheetTitle,
  AtralumeBottomSheetContent,
  AtralumeBottomSheetActions,
  AtralumeBottomSheetClose,
} from "@atralume/angular/bottom-sheet";
import { AtralumeSnackbar } from "@atralume/angular/snackbar";
@Component({
  selector: "atr-overlay-demo",
  imports: [
    AtralumeButton,
    AtralumeTooltip,
    AtralumeMenu,
    AtralumeMenuTrigger,
    AtralumeMenuItem,
    AtralumeMenuCheckboxItem,
    AtralumeMenuRadioItem,
    AtralumeMenuGroup,
    AtralumeMenuSeparator,
    AtralumeDialogTitle,
    AtralumeDialogContent,
    AtralumeDialogActions,
    AtralumeDialogClose,
    AtralumeBottomSheetTitle,
    AtralumeBottomSheetContent,
    AtralumeBottomSheetActions,
    AtralumeBottomSheetClose,
  ],
  templateUrl: "./overlay-demo.component.html",
  styleUrl: "./overlay-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayDemo {
  readonly family = input("all");
  protected readonly result = signal("No action");
  protected readonly notifications = signal(false);
  private readonly dialog = inject(AtralumeDialog);
  private readonly sheet = inject(AtralumeBottomSheet);
  private readonly snackbar = inject(AtralumeSnackbar);
  private readonly owner = inject(DestroyRef);
  private readonly views = inject(ViewContainerRef);
  toggleNotifications(): void {
    this.notifications.update((value) => !value);
  }
  openDialog(template: TemplateRef<unknown>, event: Event): void {
    this.dialog
      .open<unknown, unknown, string>(template, {
        origin: event.currentTarget as HTMLElement,
        owner: this.owner,
        viewContainerRef: this.views,
        labelledBy: "demo-dialog-title",
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((result) => this.result.set(result ?? "Closed dialog"));
  }
  openSheet(
    template: TemplateRef<unknown>,
    event: Event,
    standard = false,
  ): void {
    this.sheet
      .open<unknown, unknown, string>(template, {
        origin: event.currentTarget as HTMLElement,
        owner: this.owner,
        viewContainerRef: this.views,
        label: "Share profile",
        mode: standard ? "standard" : "modal",
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((result) => this.result.set(result ?? "Closed sheet"));
  }
  notify(event: Event): void {
    this.snackbar
      .open({
        message: "Profile saved",
        action: "Undo",
        dismissLabel: "Dismiss notification",
        duration: 0,
        origin: event.currentTarget as HTMLElement,
        owner: this.owner,
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((result) => this.result.set(result));
  }
}
