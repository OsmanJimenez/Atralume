import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeSpeedDial, AtralumeSpeedDialAction } from "../../index";
@Component({
  imports: [AtralumeSpeedDial, AtralumeSpeedDialAction],
  template:
    '<atr-speed-dial id="create-dial" label="Create"><button atrSpeedDialAction type="button">Document</button><button atrSpeedDialAction type="button">Project</button><button atrSpeedDialAction type="button" disabled>Unavailable</button></atr-speed-dial>',
})
class Host {}
describe("Speed Dial", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const button = e.querySelector("button") as HTMLButtonElement;
    expect(button.getAttribute("aria-expanded")).toBe("false");
    button.click();
    f.detectChanges();
    await f.whenStable();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("aria-controls")).toBe("create-dial-actions");
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    f.detectChanges();
    await f.whenStable();
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
