import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeSkeleton } from "../../index";
@Component({
  imports: [AtralumeSkeleton],
  template:
    '<section aria-busy="true" aria-label="Loading profile"><atr-skeleton appearance="circle" /><atr-skeleton /><atr-skeleton appearance="rounded" style="--atr-comp-skeleton-height:4rem;margin-top:1rem" /></section>',
})
class Host {}
describe("Skeleton", () => {
  it("preserves semantic composition and observable behavior", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("atr-skeleton")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(e.querySelector("section")?.getAttribute("aria-busy")).toBe("true");
    expect(e.querySelector("[role=status]")).toBeNull();
  });
});
