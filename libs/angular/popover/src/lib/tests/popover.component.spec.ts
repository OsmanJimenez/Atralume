import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumePopover } from "../../index";
import { AtralumeButton } from "@atralume/angular/button";
@Component({
  imports: [AtralumePopover, AtralumeButton],
  template:
    '<button atrButton type="button" (click)="open($event)">Details</button>@if(origin();as source){<atr-popover [origin]="source" [(opened)]="opened" panelRole="dialog" label="Details" focus="first"><button atrButton type="button">Save</button></atr-popover>}',
})
class Host {
  readonly origin = signal<HTMLElement | null>(null);
  readonly opened = signal(false);
  open(event: Event): void {
    this.origin.set(event.currentTarget as HTMLElement);
    this.opened.set(true);
  }
}
describe("Popover context and lifetime", () => {
  it("inherits origin context and disposes its panel with its owner", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    f.nativeElement.setAttribute("data-atr-theme", "dark");
    const button = f.nativeElement.querySelector("button") as HTMLButtonElement;
    button.click();
    await f.whenStable();
    const panel = document.querySelector(".atr-popover-panel");
    expect(panel?.getAttribute("data-atr-theme")).toBe("dark");
    expect(
      document.querySelector("[role=dialog]")?.getAttribute("aria-label"),
    ).toBe("Details");
    f.destroy();
    expect(document.querySelector(".atr-popover-panel")).toBeNull();
  });
});
