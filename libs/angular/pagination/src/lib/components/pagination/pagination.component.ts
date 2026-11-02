import { AtralumeButton } from "@atralume/angular/button";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  computed,
  booleanAttribute,
} from "@angular/core";

@Component({
  selector: "atr-pagination",
  standalone: true,
  imports: [AtralumeButton],

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
  readonly href = input<((page: number) => string) | null>(null);
  protected readonly total = computed(() => {
    const count = this.pageCount();
    if (!Number.isInteger(count) || count < 1)
      throw new Error("Pagination pageCount must be a positive integer.");
    return count;
  });
  protected readonly current = computed(() =>
    Math.max(1, Math.min(this.total(), Math.trunc(this.page()) || 1)),
  );
  protected readonly controls = computed(() => {
    const total = this.total(),
      page = this.current(),
      siblings = Math.max(0, Math.trunc(this.siblingCount()));
    const pages = new Set([1, total]);
    for (
      let n = Math.max(1, page - siblings);
      n <= Math.min(total, page + siblings);
      n++
    )
      pages.add(n);
    const controls: {
      key: string;
      page: number | null;
      text: string;
      label: string;
      boundary?: boolean;
    }[] = [
      {
        key: "first",
        page: 1,
        text: "First",
        label: "First page",
        boundary: page === 1,
      },
      {
        key: "previous",
        page: Math.max(1, page - 1),
        text: "Previous",
        label: "Previous page",
        boundary: page === 1,
      },
    ];
    let previous = 0;
    for (const n of [...pages].sort((a, b) => a - b)) {
      if (n - previous > 1)
        controls.push({
          key: "ellipsis-" + n,
          page: null,
          text: "…",
          label: "",
        });
      controls.push({
        key: "page-" + n,
        page: n,
        text: String(n),
        label: "Page " + n,
      });
      previous = n;
    }
    controls.push(
      {
        key: "next",
        page: Math.min(total, page + 1),
        text: "Next",
        label: "Next page",
        boundary: page === total,
      },
      {
        key: "last",
        page: total,
        text: "Last",
        label: "Last page",
        boundary: page === total,
      },
    );
    return controls;
  });
  protected blocked(boundary = false): boolean {
    return this.disabled() || this.loading() || boundary;
  }
  protected select(
    page: number,
    boundary: boolean | undefined,
    event: Event,
  ): void {
    if (this.blocked(boundary)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.page.set(page);
  }
}
