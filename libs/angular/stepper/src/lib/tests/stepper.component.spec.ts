import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeStepper, AtralumeStep } from "../../index";

@Component({
  imports: [AtralumeStepper, AtralumeStep],
  template:
    '<atr-stepper label="Setup"><atr-step label="Profile">First content</atr-step><atr-step label="Review">Lazy review content</atr-step></atr-stepper>',
})
class Host {}

describe("Stepper", () => {
  it("renders Taiga step headers and lazily shows the active panel", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const buttons = f.nativeElement.querySelectorAll(
      "button[tuiStep]",
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(2);
    expect(f.nativeElement.querySelector("tui-stepper")).not.toBeNull();
    const firstPanelId = buttons[0].getAttribute("aria-controls");
    expect(firstPanelId).not.toBeNull();
    expect(f.nativeElement.querySelector(`#${firstPanelId}`)).not.toBeNull();
    expect(buttons[1].getAttribute("aria-controls")).toBeNull();
    expect(f.nativeElement.textContent).not.toContain("Lazy review content");
    buttons[1].click();
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain("Lazy review content");
    expect(
      f.nativeElement.querySelector("[aria-current=step]")?.textContent,
    ).toContain("Review");
    const secondPanelId = buttons[1].getAttribute("aria-controls");
    expect(secondPanelId).not.toBeNull();
    expect(f.nativeElement.querySelector(`#${secondPanelId}`)).not.toBeNull();
    expect(document.activeElement?.getAttribute("role")).toBe("region");
  });
});
