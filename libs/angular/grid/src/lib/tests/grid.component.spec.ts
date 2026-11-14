import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeGrid, AtralumeGridItem } from "../../index";

@Component({
  imports: [AtralumeGrid, AtralumeGridItem],
  template: `
    <atr-grid [columns]="columns" gap="sm">
      <div atrGridItem>One</div>
      <div atrGridItem [span]="2">Two</div>
      <div atrGridItem span="full">Full</div>
    </atr-grid>
  `,
})
class Host {
  columns: number | "auto" = 3;
}

describe("AtralumeGrid", () => {
  it("exposes columns, gap and item spans", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const grid = fixture.nativeElement.querySelector(
      "atr-grid",
    ) as HTMLElement;
    expect(grid.dataset["columns"]).toBe("3");
    expect(grid.dataset["gap"]).toBe("sm");
    expect(grid.style.getPropertyValue("--atr-grid-gap")).toContain(
      "spacing-sm",
    );
    const items = [
      ...fixture.nativeElement.querySelectorAll(".atr-grid-item"),
    ] as HTMLElement[];
    expect(items[1].dataset["span"]).toBe("2");
    expect(items[2].dataset["span"]).toBe("full");
  });

  it("supports auto-fill columns", async () => {
    const fixture = TestBed.createComponent(AtralumeGrid);
    fixture.componentRef.setInput("columns", "auto");
    fixture.componentRef.setInput("gap", "md");
    fixture.componentRef.setInput("minTrack", "12rem");
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.dataset["columns"]).toBe("auto");
    expect(host.style.getPropertyValue("--atr-grid-min")).toBe("12rem");
  });
});
