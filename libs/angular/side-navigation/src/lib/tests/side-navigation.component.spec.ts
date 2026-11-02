import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeSideNavigationContainer,
  AtralumeSideNavigation,
  AtralumeSideNavigationHeader,
  AtralumeSideNavigationContent,
  AtralumeSideNavigationItem,
  AtralumeSideNavigationGroup,
  AtralumeSideNavigationLabel,
} from "../../index";
@Component({
  imports: [
    AtralumeSideNavigationContainer,
    AtralumeSideNavigation,
    AtralumeSideNavigationHeader,
    AtralumeSideNavigationContent,
    AtralumeSideNavigationItem,
    AtralumeSideNavigationGroup,
    AtralumeSideNavigationLabel,
  ],
  template:
    '<button #origin type="button" (click)="opened=!opened" [attr.aria-expanded]="opened" aria-controls="workspace-nav">Toggle navigation</button><atr-side-navigation-container><atr-side-navigation panelId="workspace-nav" label="Workspace" [mode]="mode" [(opened)]="opened" [origin]="origin"><header atrSideNavigationHeader><h2>Workspace</h2></header><section atrSideNavigationGroup><a atrSideNavigationItem href="#overview" active><span aria-hidden="true">\u2302</span><span atrSideNavigationLabel>Overview</span></a><a atrSideNavigationItem href="#settings"><span aria-hidden="true">\u2699</span><span atrSideNavigationLabel>Settings</span></a></section></atr-side-navigation><main atrSideNavigationContent>Application content remains usable in side and push modes.</main></atr-side-navigation-container>',
})
class Host {
  opened = true;
  mode: "side" | "over" | "push" = "side";
}
describe("Side Navigation", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("nav")?.getAttribute("aria-label")).toBe(
      "Workspace",
    );
    expect(document.querySelector(".atr-side-navigation-overlay")).toBeNull();
    expect(e.querySelector("main")?.textContent).toContain(
      "Application content",
    );
    (e.querySelector("button") as HTMLButtonElement).click();
    f.detectChanges();
    await f.whenStable();
    expect(e.querySelector("nav")).toBeNull();
  });
});
