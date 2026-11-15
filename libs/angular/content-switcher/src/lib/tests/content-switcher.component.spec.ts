import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeContentSwitcher } from "../../index";

@Component({
  imports: [AtralumeContentSwitcher],
  template: `
    <atr-content-switcher
      [size]="size"
      [(activeItemIndex)]="active"
      [disabled]="disabled"
    >
      <button type="button">List</button>
      <button type="button">Board</button>
      <button type="button">Calendar</button>
    </atr-content-switcher>
  `,
})
class Host {
  size: "s" | "m" | "l" = "m";
  active = 1;
  disabled = false;
}

describe("AtralumeContentSwitcher", () => {
  it("hosts tui-segmented and projects options", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector("atr-content-switcher")).toBeTruthy();
    expect(host.querySelector("tui-segmented")).toBeTruthy();
    expect(host.querySelectorAll("tui-segmented button").length).toBe(3);
  });

  it("forwards size, active index, and disabled", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size = "s";
    fixture.componentInstance.disabled = true;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const atr = fixture.nativeElement.querySelector(
      "atr-content-switcher",
    ) as HTMLElement;
    expect(atr.getAttribute("data-size")).toBe("s");
    expect(atr.hasAttribute("data-disabled")).toBe(true);
    expect(fixture.componentInstance.active).toBe(1);
  });
});
