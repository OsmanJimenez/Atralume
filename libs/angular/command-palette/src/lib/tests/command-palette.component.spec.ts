import { TestBed } from "@angular/core/testing";
import { AtralumeCommandPalette } from "../../index";
describe("Command Palette nested actions", () => {
  it("navigates nested command levels and emits a leaf command", async () => {
    const f = TestBed.createComponent(AtralumeCommandPalette<string>);
    f.componentRef.setInput("commands", [
      {
        id: "settings",
        label: "Settings",
        value: "settings",
        children: [{ id: "theme", label: "Change theme", value: "theme" }],
      },
    ]);
    f.autoDetectChanges();
    await f.whenStable();
    const invoked: string[] = [];
    f.componentInstance.invoked.subscribe((command) =>
      invoked.push(command.value),
    );
    f.componentInstance.open();
    await f.whenStable();
    (document.querySelector("atr-option") as HTMLElement).click();
    await f.whenStable();
    expect(document.querySelector("atr-option")?.textContent).toContain(
      "Change theme",
    );
    expect(invoked).toEqual([]);
    (document.querySelector("atr-option") as HTMLElement).click();
    await f.whenStable();
    expect(invoked).toEqual(["theme"]);
    expect(document.querySelector("[role=dialog]")).toBeNull();
  });
});
