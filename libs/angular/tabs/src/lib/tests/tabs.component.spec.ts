import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeTabs,
  AtralumeTabList,
  AtralumeTab,
  AtralumeTabPanel,
} from "../../index";
@Component({
  imports: [AtralumeTabs, AtralumeTabList, AtralumeTab, AtralumeTabPanel],
  template:
    '<atr-tabs label="Profile sections"><tui-tabs atrTabList><button atrTab id="overview-tab" panel="overview-panel" type="button">Overview</button><button atrTab id="activity-tab" panel="activity-panel" type="button">Activity</button><button atrTab id="disabled-tab" panel="disabled-panel" type="button" disabled>Unavailable</button></tui-tabs><section atrTabPanel id="overview-panel" labelledBy="overview-tab">Profile overview</section><section atrTabPanel id="activity-panel" labelledBy="activity-tab">Recent activity</section><section atrTabPanel id="disabled-panel" labelledBy="disabled-tab">Unavailable panel</section></atr-tabs>',
})
class Host {}
describe("Tabs", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const tabs = e.querySelectorAll<HTMLButtonElement>("[role=tab]");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    tabs[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    f.detectChanges();
    await f.whenStable();
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[2].disabled).toBe(true);
    expect(e.querySelector<HTMLElement>("#overview-panel")?.hidden).toBe(true);
    expect(
      e.querySelector("#activity-panel")?.getAttribute("aria-labelledby"),
    ).toBe("activity-tab");
  });
});
