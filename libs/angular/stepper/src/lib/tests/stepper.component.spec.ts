import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, Validators } from "@angular/forms";
import { AtralumeStepper, AtralumeStep } from "../../index";
@Component({
  imports: [AtralumeStepper, AtralumeStep],
  template:
    '<atr-stepper label="Setup" linear><atr-step label="Profile" [control]="control">First content</atr-step><atr-step label="Review">Lazy review content</atr-step></atr-stepper>',
})
class Host {
  readonly control = new FormControl("", {
    nonNullable: true,
    validators: [Validators.required],
  });
}
describe("Linear Stepper", () => {
  it("guards invalid steps, derives completion from validity and lazily renders content", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const buttons = f.nativeElement.querySelectorAll(
      "button",
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].disabled).toBe(true);
    const firstPanelId = buttons[0].getAttribute("aria-controls");
    expect(firstPanelId).not.toBeNull();
    expect(f.nativeElement.querySelector(`#${firstPanelId}`)).not.toBeNull();
    expect(buttons[1].getAttribute("aria-controls")).toBeNull();
    expect(f.nativeElement.textContent).not.toContain("Lazy review content");
    f.componentInstance.control.setValue("Ready");
    await f.whenStable();
    expect(buttons[1].disabled).toBe(false);
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
