import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumePagination } from "../../index";
@Component({
  imports: [AtralumePagination],
  template: '<atr-pagination [pageCount]="50" [page]="3" />',
})
class Host {}
describe("Pagination", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const next = e.querySelectorAll<HTMLButtonElement>("button");
    expect(
      [...next].every((button) => button.classList.contains("atr-button")),
    ).toBe(true);
    const target = [...next].find(
      (button) => button.getAttribute("aria-label") === "Next page",
    );
    target?.click();
    f.detectChanges();
    await f.whenStable();
    expect(e.querySelector("[aria-current=page]")?.textContent?.trim()).toBe(
      "4",
    );
    expect(e.querySelectorAll("button").length).toBeLessThan(15);
  });
});
