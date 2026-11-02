import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeBreadcrumbs,
  AtralumeBreadcrumbItem,
  AtralumeBreadcrumbSeparator,
  AtralumeBreadcrumbOverflow,
} from "../../index";
@Component({
  imports: [
    AtralumeBreadcrumbs,
    AtralumeBreadcrumbItem,
    AtralumeBreadcrumbSeparator,
    AtralumeBreadcrumbOverflow,
  ],
  template:
    '<nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#home">Home</a><span atrBreadcrumbSeparator>/</span></li><li><a atrBreadcrumbItem href="#projects">Projects</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Atralume</span></li></ol></nav>',
})
class Host {}
describe("Breadcrumbs", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("nav")?.getAttribute("aria-label")).toBe(
      "Breadcrumb",
    );
    expect(e.querySelector("[aria-current=page]")?.textContent).toBe(
      "Atralume",
    );
    expect(
      e.querySelector(".atr-breadcrumb-separator")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});
