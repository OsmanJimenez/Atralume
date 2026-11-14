import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeEmptyState } from "../../index";
@Component({
  imports: [AtralumeEmptyState],
  template:
    '<atr-empty-state title="Nothing here" description="Try another query."><button atrEmptyStatePrimary type="button">Reset</button></atr-empty-state>',
})
class Host {}
describe("AtralumeEmptyState", () => {
  it("projects semantic title, description, and action", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector("h2")?.textContent).toContain("Nothing here");
    expect(element.querySelector("button")?.textContent).toContain("Reset");
  });
});
