import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  untracked,
} from "@angular/core";
import { TuiPagination } from "@taiga-ui/kit";

/**
 * Thin pagination over Taiga `tui-pagination`.
 * Public `page` stays 1-based; Taiga `index` is 0-based.
 */
@Component({
  selector: "atr-pagination",
  standalone: true,
  imports: [TuiPagination],
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-pagination" },
})
export class AtralumePagination {
  readonly label = input("Pagination");
  readonly page = model(1);
  readonly pageCount = input(1);
  readonly siblingCount = input(1);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** @deprecated Dropped — use router links around `tui-pagination` if needed. */
  readonly href = input<((page: number) => string) | null>(null);

  protected readonly total = computed(() => {
    const count = this.pageCount();
    if (!Number.isInteger(count) || count < 1)
      throw new Error("Pagination pageCount must be a positive integer.");
    return count;
  });

  protected readonly index = computed(() =>
    Math.max(0, Math.min(this.total() - 1, (Math.trunc(this.page()) || 1) - 1)),
  );

  protected readonly activePadding = computed(() =>
    Math.max(0, Math.trunc(this.siblingCount())),
  );

  protected readonly blocked = computed(
    () => this.disabled() || this.loading(),
  );

  constructor() {
    effect(() => {
      const next = this.index() + 1;
      untracked(() => {
        if (this.page() !== next) this.page.set(next);
      });
    });
  }

  protected onIndex(index: number): void {
    this.page.set(index + 1);
  }
}
