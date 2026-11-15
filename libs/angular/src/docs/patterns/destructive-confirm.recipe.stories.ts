import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  ViewContainerRef,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeDialog,
  AtralumeDialogActions,
  AtralumeDialogClose,
  AtralumeDialogContent,
  AtralumeDialogTitle,
} from "@osmanjimenez/atralume/dialog";

/**
 * Story host for the destructive confirmation composition (not a package).
 */
@Component({
  selector: "atr-destructive-confirm-recipe",
  standalone: true,
  imports: [
    AtralumeButton,
    AtralumeDialogTitle,
    AtralumeDialogContent,
    AtralumeDialogActions,
    AtralumeDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button atrButton type="button" appearance="outlined" (click)="open($event)">
      Delete project
    </button>
    <p>Result: {{ result() }}</p>

    <ng-template #confirm>
      <h2 atrDialogTitle id="destructive-confirm-title">Delete project?</h2>
      <div atrDialogContent>
        <p>
          This permanently removes the project and its data. This action cannot
          be undone.
        </p>
      </div>
      <div atrDialogActions>
        <button atrButton type="button" atrDialogClose appearance="text">
          Cancel
        </button>
        <button
          atrButton
          type="button"
          appearance="filled"
          [atrDialogClose]="'deleted'"
        >
          Delete
        </button>
      </div>
    </ng-template>
  `,
})
class DestructiveConfirmRecipe {
  private readonly dialog = inject(AtralumeDialog);
  private readonly owner = inject(DestroyRef);
  private readonly views = inject(ViewContainerRef);
  private readonly confirmTpl =
    viewChild.required<TemplateRef<unknown>>("confirm");

  readonly result = signal("No action");

  open(event: Event): void {
    this.dialog
      .open<unknown, unknown, string>(this.confirmTpl(), {
        origin: event.currentTarget as HTMLElement,
        owner: this.owner,
        viewContainerRef: this.views,
        labelledBy: "destructive-confirm-title",
      })
      .afterClosed.pipe(takeUntilDestroyed(this.owner))
      .subscribe((value) => this.result.set(value ?? "Cancelled"));
  }
}

const meta = {
  title: "Patterns/Destructive Confirm",
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({ imports: [DestructiveConfirmRecipe] }),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    template: `<atr-destructive-confirm-recipe />`,
  }),
};
