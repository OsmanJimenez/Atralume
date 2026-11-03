import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TuiItem } from "@taiga-ui/cdk/directives/item";
import { AtralumeBreadcrumbs } from "../../index";
@Component({
  imports: [AtralumeBreadcrumbs, TuiItem],
  template: `
    <atr-breadcrumbs>
      <a *tuiItem href="#home">Home</a>
      <a *tuiItem href="#projects">Projects</a>
      <span *tuiItem>Atralume</span>
    </atr-breadcrumbs>
  `,
})
class Host {}
describe("Breadcrumbs", () => {
  it("renders Taiga breadcrumbs host", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("tui-breadcrumbs")).toBeTruthy();
    expect(e.querySelector(".atr-breadcrumbs")?.getAttribute("aria-label")).toBe(
      "Breadcrumb",
    );
  });
});
