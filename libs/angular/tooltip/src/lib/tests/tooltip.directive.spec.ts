import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeTooltip } from "../../index";
@Component({
  imports: [AtralumeTooltip],
  template:
    '<button type="button" atrTooltip="Help text" tooltipId="test-tooltip" [showDelay]="10" aria-describedby="existing">Help</button>',
})
class Host {}
describe("Tooltip", () => {
  it("opens with a stable description, preserves existing IDs and disposes on destroy", () => {
    vi.useFakeTimers();
    try {
      const f = TestBed.createComponent(Host);
      f.detectChanges();
      const button = f.nativeElement.querySelector(
        "button",
      ) as HTMLButtonElement;
      button.dispatchEvent(new Event("pointerenter"));
      vi.advanceTimersByTime(10);
      f.detectChanges();
      expect(button.getAttribute("aria-describedby")).toBe(
        "existing test-tooltip",
      );
      expect(document.querySelector("atr-tooltip-panel")).not.toBeNull();
      f.destroy();
      expect(document.querySelector("atr-tooltip-panel")).toBeNull();
      expect(button.getAttribute("aria-describedby")).toBe("existing");
    } finally {
      vi.useRealTimers();
    }
  });
});
