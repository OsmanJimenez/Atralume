import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AtralumeRating } from "../../index";

@Component({
  imports: [AtralumeRating, ReactiveFormsModule],
  template: `<atr-rating label="Score" [formControl]="control" [max]="5" />`,
})
class Host {
  readonly control = new FormControl<number | null>(null);
}

describe("Rating", () => {
  it("renders with a label and hosts tui-rating", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const host = f.nativeElement.querySelector("atr-rating") as HTMLElement;
    expect(host.getAttribute("aria-label")).toBe("Score");
    expect(host.querySelector("tui-rating")).toBeTruthy();
  });

  it("syncs Reactive Forms values with the inner rating control", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    f.componentInstance.control.setValue(4);
    await f.whenStable();
    expect(f.nativeElement.querySelector("atr-rating")).toBeTruthy();
    expect(f.componentInstance.control.value).toBe(4);
    const range = f.nativeElement.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement;
    expect(range.value).toBe("4");
  });
});
