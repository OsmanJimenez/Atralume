import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeVisuallyHidden } from "../../index";

@Component({
  imports: [AtralumeVisuallyHidden],
  template:
    '<a href="#main" atrVisuallyHidden [focusable]="focusable()">Skip to content</a><span atrVisuallyHidden>Screen reader only</span>',
})
class Host {
  focusable = signal(false);
}

describe("AtralumeVisuallyHidden", () => {
  it("applies host class and optional focusable variant", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const link = f.nativeElement.querySelector("a") as HTMLElement;
    const span = f.nativeElement.querySelector("span") as HTMLElement;
    expect(link.classList.contains("atr-visually-hidden")).toBe(true);
    expect(link.classList.contains("atr-visually-hidden--focusable")).toBe(
      false,
    );
    expect(span.classList.contains("atr-visually-hidden")).toBe(true);
    f.componentInstance.focusable.set(true);
    f.detectChanges();
    await f.whenStable();
    expect(link.classList.contains("atr-visually-hidden--focusable")).toBe(
      true,
    );
  });
});
