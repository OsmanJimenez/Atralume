import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumePopover } from "../../index";
import { AtralumeButton } from "@atralume/angular/button";
@Component({
  imports: [AtralumePopover, AtralumeButton],
  template:
    '<button atrButton atrPopover type="button" [atrPopover]="panel" [(opened)]="opened" panelRole="dialog" label="Details">Details</button><ng-template #panel><button atrButton type="button">Save</button></ng-template>',
})
class Host {
  readonly opened = signal(false);
}
describe("Popover context and lifetime", () => {
  it("inherits origin context and disposes its panel with its owner", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    f.nativeElement.setAttribute("data-atr-theme", "dark");
    const button = f.nativeElement.querySelector("button") as HTMLButtonElement;
    f.componentInstance.opened.set(true);
    await f.whenStable();
    const panel = document.querySelector('[role="dialog"]');
    expect(panel?.getAttribute("data-atr-theme")).toBe("dark");
    expect(
      document.querySelector("[role=dialog]")?.getAttribute("aria-label"),
    ).toBe("Details");
    f.destroy();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
