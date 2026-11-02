import { TestBed } from "@angular/core/testing";
import { AtralumeCombobox } from "../../index";
describe("Combobox confirmation", () => {
  it("opens its initial controlled state after the projected trigger exists", async () => {
    const f = TestBed.createComponent(AtralumeCombobox<string>);
    f.componentRef.setInput("label", "Initially open");
    f.componentRef.setInput("opened", true);
    f.componentRef.setInput("options", [
      { id: "a", label: "Alpha", value: "a" },
    ]);
    f.autoDetectChanges();
    await f.whenStable();
    expect(document.querySelector("atr-option")?.textContent).toContain(
      "Alpha",
    );
    expect(
      f.nativeElement
        .querySelector("[role=combobox]")
        ?.getAttribute("aria-expanded"),
    ).toBe("true");
  });
  it("closes without replacing a confirmed value and supports explicit free-text conversion", async () => {
    const f = TestBed.createComponent(AtralumeCombobox<string>);
    f.componentRef.setInput("label", "Tool");
    f.componentRef.setInput("options", [
      { id: "a", label: "Alpha", value: "a" },
      { id: "b", label: "Beta", value: "b" },
    ]);
    f.componentInstance.writeValue("a");
    f.autoDetectChanges();
    await f.whenStable();
    f.componentInstance.open();
    await f.whenStable();
    f.componentInstance.close();
    await f.whenStable();
    expect(f.componentInstance.value()).toBe("a");
    f.componentRef.setInput("textToValue", (text: string) => text);
    await f.whenStable();
    const input = f.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "Custom";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await f.whenStable();
    expect(f.componentInstance.value()).toBe("Custom");
    f.destroy();
    expect(document.querySelector(".atr-combobox-panel")).toBeNull();
  });

  it("selects the first matching option when Enter confirms a filtered query", async () => {
    const f = TestBed.createComponent(AtralumeCombobox<string>);
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
    f.componentInstance.open();
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
});
