import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeActionBar } from "../../index";

@Component({
  imports: [AtralumeActionBar],
  template: `
    <atr-action-bar [expanded]="expanded" [size]="size">
      <span>Selected: 3</span>
      <button type="button">Archive</button>
      <button type="button">Delete</button>
    </atr-action-bar>
  `,
})
class Host {
  expanded = false;
  size: "s" | "m" = "m";
}

describe("AtralumeActionBar", () => {
  it("hosts tui-action-bar and projects actions", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector("atr-action-bar")).toBeTruthy();
    expect(host.querySelector("tui-action-bar")).toBeTruthy();
    expect(host.textContent).toContain("Selected: 3");
    expect(host.querySelectorAll("button").length).toBe(2);
  });

  it("forwards expanded and size", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.expanded = true;
    fixture.componentInstance.size = "s";
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const atr = fixture.nativeElement.querySelector(
      "atr-action-bar",
    ) as HTMLElement;
    expect(atr.hasAttribute("data-expanded")).toBe(true);
    expect(atr.getAttribute("data-size")).toBe("s");
  });
});
