import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import { AtralumeIconButton } from "@osmanjimenez/atralume/icon-button";
import {
  AtralumeIcon,
  ATRALUME_BUILTIN_ICONS,
  provideAtralumeIcons,
  type AtralumeIconCatalogEntry,
  type AtralumeIconCategory,
  type IconSize,
} from "@osmanjimenez/atralume/icon";
import {
  ATRALUME_ICON_CATALOG_VERSION,
  countAtralumeIcons,
  listAtralumeIconCategories,
  searchAtralumeIcons,
} from "@osmanjimenez/atralume/icon/catalog";
import { AtralumeKbd } from "@osmanjimenez/atralume/kbd";

const PAGE_SIZE = 96;

type PreviewTone =
  | "inherit"
  | "primary"
  | "on-surface"
  | "success"
  | "warning"
  | "error";

type PreviewSurface = "standard" | "elevated" | "glass";

@Component({
  selector: "atr-doc-icon-explorer",
  standalone: true,
  imports: [
    FormsModule,
    AtralumeIcon,
    AtralumeButton,
    AtralumeIconButton,
    AtralumeKbd,
  ],
  providers: [provideAtralumeIcons(ATRALUME_BUILTIN_ICONS)],
  templateUrl: "./icon-explorer.component.html",
  styleUrl: "./icon-explorer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-doc-icon-explorer" },
})
export class IconExplorerComponent {
  protected readonly catalogVersion = ATRALUME_ICON_CATALOG_VERSION;
  protected readonly totalIcons = countAtralumeIcons();
  protected readonly categories = ["all", ...listAtralumeIconCategories()] as const;

  protected readonly query = signal("");
  protected readonly category = signal<AtralumeIconCategory | "all">("all");
  protected readonly page = signal(1);
  protected readonly selectedName = signal<string | null>("heart");
  protected readonly previewSize = signal<IconSize>("large");
  protected readonly previewTone = signal<PreviewTone>("inherit");
  protected readonly previewSurface = signal<PreviewSurface>("standard");
  protected readonly copyMessage = signal<string | null>(null);

  protected readonly filtered = computed(() =>
    searchAtralumeIcons({
      query: this.query(),
      category: this.category(),
    }),
  );

  protected readonly visible = computed(() => {
    const limit = this.page() * PAGE_SIZE;
    return this.filtered().slice(0, limit);
  });

  protected readonly hasMore = computed(
    () => this.visible().length < this.filtered().length,
  );

  protected readonly selected = computed(() => {
    const name = this.selectedName();
    if (!name) return null;
    return (
      this.filtered().find((entry) => entry.name === name) ??
      searchAtralumeIcons({ query: name, limit: 1 })[0] ??
      null
    );
  });

  protected readonly snippet = computed(() => {
    const entry = this.selected();
    if (!entry) return "";
    if (entry.source === "atralume") {
      return `<atr-icon name="${entry.name}" [decorative]="false" label="${entry.name}" />`;
    }
    return `<atr-icon engine="tui" name="${entry.tuiName}" [decorative]="false" label="${entry.name}" />`;
  });

  protected readonly previewColor = computed(() => {
    switch (this.previewTone()) {
      case "primary":
        return "var(--atr-sys-color-primary)";
      case "on-surface":
        return "var(--atr-sys-color-on-surface)";
      case "success":
        return "var(--atr-sys-color-success)";
      case "warning":
        return "var(--atr-sys-color-warning)";
      case "error":
        return "var(--atr-sys-color-error)";
      default:
        return "currentColor";
    }
  });

  protected onQueryInput(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  protected selectCategory(next: AtralumeIconCategory | "all"): void {
    this.category.set(next);
    this.page.set(1);
  }

  protected selectIcon(entry: AtralumeIconCatalogEntry): void {
    this.selectedName.set(entry.name);
  }

  protected loadMore(): void {
    this.page.update((value) => value + 1);
  }

  protected iconEngine(entry: AtralumeIconCatalogEntry): "registry" | "tui" {
    return entry.source === "atralume" ? "registry" : "tui";
  }

  protected iconName(entry: AtralumeIconCatalogEntry): string {
    return entry.source === "atralume" ? entry.name : entry.tuiName;
  }

  protected async copyText(value: string, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copyMessage.set(`Copied ${label}`);
    } catch {
      this.copyMessage.set("Clipboard unavailable");
    }
    window.setTimeout(() => this.copyMessage.set(null), 1600);
  }

  protected copyName(entry: AtralumeIconCatalogEntry): void {
    void this.copyText(
      entry.source === "atralume" ? entry.name : entry.tuiName,
      "name",
    );
  }

  protected copySnippet(): void {
    void this.copyText(this.snippet(), "snippet");
  }

}
