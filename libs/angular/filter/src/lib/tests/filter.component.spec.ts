import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeFilter } from "../../index";
@Component({
  imports: [AtralumeFilter],
  template:
    '<atr-filter label="Topics" [options]="options" (selectionChange)="changed = $event" />',
})
class Host {
  options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta", disabled: true },
  ];
  changed: readonly string[] = [];
}
describe("AtralumeFilter", () => {
  it("emits selected values and keeps disabled options disabled", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Alpha");
    expect(fixture.nativeElement.textContent).toContain("Beta");
    const inputs = fixture.nativeElement.querySelectorAll(
      "input",
    ) as NodeListOf<HTMLInputElement>;
    inputs[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changed).toEqual(["a"]);
    expect(inputs[1].disabled).toBe(true);
    (
      fixture.nativeElement.querySelector(
        ".atr-filter__clear",
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.changed).toEqual([]);
  });
});
