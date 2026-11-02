import { TestBed } from "@angular/core/testing";
import { AtralumeCarousel } from "../../index";
describe("AtralumeCarousel", () => {
  it("does not autoplay by default and clamps navigation", () => {
    const fixture = TestBed.createComponent(AtralumeCarousel);
    fixture.componentRef.setInput("slides", [{ id: "a", label: "A" }, { id: "b", label: "B" }]); fixture.detectChanges();
    expect(fixture.componentInstance.paused()).toBe(true); fixture.componentInstance.next(); fixture.componentInstance.next(); expect(fixture.componentInstance.activeIndex()).toBe(1); fixture.componentInstance.previous(); expect(fixture.componentInstance.activeIndex()).toBe(0);
  });
});
