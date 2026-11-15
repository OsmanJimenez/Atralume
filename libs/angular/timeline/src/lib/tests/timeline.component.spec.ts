import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { TuiTimelineItem } from "@taiga-ui/kit";
import { AtralumeTimeline } from "../../index";

@Component({
  imports: [AtralumeTimeline, TuiTimelineItem],
  template: `
    <atr-timeline [orientation]="orientation" [max]="max">
      <label tuiTimelineItem [draggable]="false" [resizable]="false" [value]="a"
        >Alpha</label
      >
      <label tuiTimelineItem [draggable]="false" [resizable]="false" [value]="b"
        >Beta</label
      >
    </atr-timeline>
  `,
})
class Host {
  orientation: "horizontal" | "vertical" = "horizontal";
  max = 50;
  readonly a: readonly [number, number] = [0, 10];
  readonly b: readonly [number, number] = [20, 35];
}

describe("AtralumeTimeline", () => {
  it("renders atr-timeline and projects timeline items", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const timeline = host.querySelector("atr-timeline") as HTMLElement;
    expect(timeline).toBeTruthy();
    expect(host.querySelectorAll("label[tuiTimelineItem]").length).toBe(2);
    expect(timeline.textContent).toContain("Alpha");
  });

  it("forwards orientation and max on the brand host", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.orientation = "vertical";
    fixture.componentInstance.max = 80;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const atr = fixture.nativeElement.querySelector(
      "atr-timeline",
    ) as HTMLElement;
    expect(atr.getAttribute("data-orientation")).toBe("vertical");
    const cmp = fixture.debugElement.query(By.directive(AtralumeTimeline))
      .componentInstance as AtralumeTimeline;
    expect(cmp.max()).toBe(80);
  });
});
