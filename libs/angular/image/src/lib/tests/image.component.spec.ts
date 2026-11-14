import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeImage } from "../../index";
@Component({
  imports: [AtralumeImage],
  template:
    '<atr-image src="primary.svg" fallbackSrc="fallback.svg" alt="A descriptive image" aspectRatio="square" />',
})
class Host {}
describe("AtralumeImage", () => {
  it("keeps the accessible alt text, stable aspect ratio, and fallback state", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      "atr-image",
    ) as HTMLElement;
    const image = host.querySelector("img") as HTMLImageElement;
    expect(image.alt).toBe("A descriptive image");
    expect(host.getAttribute("data-aspect-ratio")).toBe("square");
    image.dispatchEvent(new Event("error"));
    fixture.detectChanges();
    expect(
      (host.querySelector("img") as HTMLImageElement).getAttribute("src"),
    ).toContain("fallback.svg");
  });
});
