import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeListbox, type AtralumeOptionData } from "../../index";
import { pressKey } from "../../../../src/docs/phase3/keyboard";
@Component({
  imports: [AtralumeListbox],
  template:
    '<atr-listbox label="People" [options]="options()" [(value)]="value" [selectionMode]="multiple() ? \'multiple\' : \'single\'" [disabled]="disabled()" />',
})
class Host {
  readonly options = signal<readonly AtralumeOptionData<{ id: number }>[]>([
    { id: "one", label: "Ada", value: { id: 1 } },
    { id: "two", label: "Grace", value: { id: 2 }, disabled: true },
    { id: "three", label: "Linus", value: { id: 3 } },
  ]);
  readonly value = signal<readonly { id: number }[]>([{ id: 1 }]);
  readonly multiple = signal(false);
  readonly disabled = signal(false);
}
describe("Listbox selection and focus", () => {
  it("compares object values, skips disabled options and keeps navigation separate from selection", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const options = () =>
      [...f.nativeElement.querySelectorAll("atr-option")] as HTMLElement[];
    expect(options()).toHaveLength(3);
    options()[0].focus();
    pressKey(document, "ArrowDown");
    await f.whenStable();
    expect(document.activeElement).toBe(options()[2]);
    expect(f.componentInstance.value()).toEqual([{ id: 1 }]);
    pressKey(document, "Enter");
    await f.whenStable();
    expect(f.componentInstance.value()).toEqual([{ id: 3 }]);
  });
  it("keeps DOM focus on the container with active descendant and updates multiple selections", async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.multiple.set(true);
    f.autoDetectChanges();
    await f.whenStable();
    const list = f.nativeElement.querySelector(
      "tui-data-list-wrapper",
    ) as HTMLElement;
    list.focus();
    pressKey(document, "End");
    await f.whenStable();
    expect(document.activeElement).toBe(list);
    pressKey(document, "Enter");
    await f.whenStable();
    expect(f.componentInstance.value()).toEqual([{ id: 1 }, { id: 3 }]);
    f.componentInstance.disabled.set(true);
    await f.whenStable();
    (f.nativeElement.querySelector("atr-option") as HTMLElement).click();
    await f.whenStable();
    expect(f.componentInstance.value()).toHaveLength(2);
  });
});
