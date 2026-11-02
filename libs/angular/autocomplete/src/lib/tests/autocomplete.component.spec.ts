import { TestBed } from "@angular/core/testing";
import { AtralumeAutocomplete } from "../../index";
describe("Autocomplete editable behavior", () => {
  it("confirms the active filtered option label on Enter", async () => {
    const f = TestBed.createComponent(AtralumeAutocomplete<string>);
    f.componentRef.setInput("label", "Search");
    f.componentRef.setInput("options", [
      { id: "a", label: "Alpha", value: "a" },
      { id: "b", label: "Packed Beta", value: "b" },
    ]);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "Beta";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    f.componentInstance.opened.set(true);
    await f.whenStable();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await f.whenStable();
    expect(f.componentInstance.value()).toBe("b");
    expect(input.value).toBe("Packed Beta");
  });

  it("defers IME input, selects a typed value, clears it and preserves readonly state", async () => {
    const f = TestBed.createComponent(AtralumeAutocomplete<string>);
    f.componentRef.setInput("label", "Search");
    f.componentRef.setInput("options", [
      { id: "a", label: "Alpha", value: "a" },
    ]);
    f.componentRef.setInput("clearable", true);
    f.autoDetectChanges();
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    );
    input.value = "Al";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.query()).toBe("");
    input.dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    );
    await f.whenStable();
    expect(f.componentInstance.query()).toBe("Al");
    (document.querySelector("atr-option") as HTMLElement).click();
    await f.whenStable();
    expect(f.componentInstance.value()).toBe("a");
    expect(input.value).toBe("Alpha");
    (
      f.nativeElement.querySelector(
        'button[aria-label="Clear Search"]',
      ) as HTMLButtonElement
    ).click();
    await f.whenStable();
    expect(f.componentInstance.value()).toBeNull();
    f.componentRef.setInput("readonly", true);
    await f.whenStable();
    expect(input.readOnly).toBe(true);
    expect(document.querySelector("atr-option")).toBeNull();
  });
});
