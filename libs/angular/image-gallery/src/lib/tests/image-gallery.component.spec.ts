import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeImageGallery } from "../../index";
@Component({
  imports: [AtralumeImageGallery],
  template: '<atr-image-gallery [images]="images" [(activeIndex)]="active" />',
})
class Host {
  active = 0;
  images = [
    { id: "one", src: "data:image/svg+xml,%3Csvg/%3E", alt: "One" },
    { id: "two", src: "data:image/svg+xml,%3Csvg/%3E", alt: "Two" },
  ];
}
describe("AtralumeImageGallery", () => {
  it("changes the controlled active index", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const next = [...fixture.nativeElement.querySelectorAll("button")].find(
      (button: HTMLButtonElement) => button.textContent?.includes("Next"),
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe(1);
  });
});
