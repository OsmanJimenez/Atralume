import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import {
  AtralumeDialog,
  type AtralumeDialogRef,
} from "@atralume/angular/dialog";
import { AtralumeCombobox } from "@atralume/angular/combobox";
import { AtralumeButton } from "@atralume/angular/button";
import { provideAtralumeIcons, arrowRightIcon } from "@atralume/angular/icon";
export interface AtralumeCommand<T> {
  readonly id: string;
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
  readonly group?: string;
  readonly keywords?: readonly string[];
  readonly shortcut?: string;
  readonly children?: readonly AtralumeCommand<T>[];
}
export interface AtralumeCommandShortcut {
  readonly key: string;
  readonly modifier: "control" | "meta" | "either";
  readonly allowInEditable?: boolean;
}

/**
 * Composition of Atralume Dialog + Combobox. No Taiga command-palette primitive;
 * evaluated against input/dropdown/data-list building blocks.
 */
@Component({
  selector: "atr-command-palette",
  standalone: true,
  imports: [AtralumeCombobox, AtralumeButton],
  templateUrl: "./command-palette.component.html",
  styleUrl: "./command-palette.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideAtralumeIcons([arrowRightIcon])],
  host: { class: "atr-command-palette" },
})
export class AtralumeCommandPalette<T> {
  readonly label = input("Commands");
  readonly commands = input<readonly AtralumeCommand<T>[]>([]);
  readonly recentCommands = input<readonly AtralumeCommand<T>[]>([]);
  readonly opened = model(false);
  readonly query = model("");
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadError = input<string | null>(null);
  readonly shortcut = input<AtralumeCommandShortcut | null>(null);
  readonly closeAfterAction = input(true, { transform: booleanAttribute });
  readonly invoked = output<AtralumeCommand<T>>();
  private readonly levels = signal<readonly AtralumeCommand<T>[]>([]);
  protected readonly canGoBack = computed(() => this.levels().length > 0);
  protected readonly options = computed(() => {
    const levels = this.levels();
    const commands = levels.length
      ? (levels[levels.length - 1].children ?? [])
      : this.commands();
    const recent = levels.length || this.query() ? [] : this.recentCommands();
    const ids = new Set<string>();
    return [...recent, ...commands]
      .filter((command) => {
        if (ids.has(command.id)) return false;
        ids.add(command.id);
        return true;
      })
      .map((command) => ({
        id: command.id,
        value: command,
        label: command.label,
        disabled: command.disabled,
        group: command.group,
        keywords: command.keywords,
      }));
  });
  private readonly content =
    viewChild.required<TemplateRef<unknown>>("content");
  private readonly combobox = viewChild(AtralumeCombobox);
  private readonly dialog = inject(AtralumeDialog);
  private readonly views = inject(ViewContainerRef);
  private readonly owner = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private ref: AtralumeDialogRef<unknown> | null = null;
  private origin: HTMLElement | undefined;
  constructor() {
    effect((onCleanup) => {
      if (!this.opened()) return;
      const template = this.content();
      const ref = untracked(() =>
        this.dialog.open(template, {
          label: this.label(),
          origin: this.origin,
          owner: this.owner,
          viewContainerRef: this.views,
        }),
      );
      this.ref = ref;
      const subscription = ref.afterClosed.subscribe(() => {
        if (this.ref === ref) {
          this.ref = null;
          this.opened.set(false);
          this.levels.set([]);
          this.query.set("");
        }
      });
      onCleanup(() => {
        subscription.unsubscribe();
        if (this.ref === ref) this.ref = null;
        ref.close();
      });
    });
    if (this.browser) {
      const unlisten = this.renderer.listen(
        this.document,
        "keydown",
        (event: KeyboardEvent) => {
          const shortcut = this.shortcut();
          if (
            !shortcut ||
            event.repeat ||
            event.isComposing ||
            event.altKey ||
            event.shiftKey ||
            event.defaultPrevented ||
            event.key.toLowerCase() !== shortcut.key.toLowerCase()
          )
            return;
          const match =
            shortcut.modifier === "either"
              ? event.ctrlKey || event.metaKey
              : shortcut.modifier === "meta"
                ? event.metaKey
                : event.ctrlKey;
          const target = event.target as HTMLElement | null;
          if (
            !match ||
            (!shortcut.allowInEditable &&
              target?.closest('input,textarea,select,[contenteditable="true"]'))
          )
            return;
          event.preventDefault();
          this.open(target ?? undefined);
        },
      );
      this.owner.onDestroy(unlisten);
    }
  }
  open(origin?: HTMLElement): void {
    this.origin = origin;
    this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
  }
  protected choose(value: AtralumeCommand<T> | string | null): void {
    if (!value || typeof value === "string") return;
    const command = value;
    if (command.disabled) return;
    if (command.children) {
      this.levels.update((levels) => [...levels, command]);
      this.query.set("");
      this.combobox()?.query.set("");
      return;
    }
    this.invoked.emit(command);
    if (this.closeAfterAction()) this.close();
  }
  back(): void {
    this.levels.update((levels) => levels.slice(0, -1));
    this.query.set("");
  }
  protected readonly displayCommand = (command: AtralumeCommand<T>) =>
    command.label;
}
