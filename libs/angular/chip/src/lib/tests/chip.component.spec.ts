import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeChip, AtralumeChipSet } from "../../index";
@Component({
  imports: [AtralumeChip, AtralumeChipSet],
  template:
    '<atr-chip-set label="Technologies" selection="single"><atr-chip kind="filter" value="angular" label="Angular" /><atr-chip kind="filter" value="css" label="CSS" /><atr-chip kind="input" value="token" label="Tokens" removable /></atr-chip-set>',
})
class Host {}
describe("Chip", () => {
  it("preserves semantic composition and observable behavior", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const buttons = e.querySelectorAll("button");
    expect(buttons[0].classList.contains("atr-button")).toBe(true);
    expect(buttons[3].classList.contains("atr-icon-button")).toBe(true);
    expect(buttons[3].querySelector("atr-icon svg")).not.toBeNull();
    buttons[0].click();
    f.detectChanges();
    await f.whenStable();
    expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    buttons[1].click();
    f.detectChanges();
    await f.whenStable();
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    expect(buttons[3].getAttribute("aria-label")).toBe("Remove Tokens");
  });
});
