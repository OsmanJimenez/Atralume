import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeImageGallery } from "../../index";

@Component({
  imports: [AtralumeImageGallery],
  template: `
    <atr-image-gallery
      [images]="images"
      [layout]="layout"
      [(activeIndex)]="active"
    />
  `,
})
class Host {
  active = 0;
  layout: "carousel" | "mosaic" = "carousel";
  images = [
    {
      id: "one",
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
      alt: "One",
      title: "One",
      location: "North",
      tags: ["nature"],
    },
    {
      id: "two",
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
      alt: "Two",
      title: "Two",
      location: "South",
      tags: ["water"],
    },
  ];
}

describe("AtralumeImageGallery", () => {
  it("changes the controlled active index in carousel layout", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const next = [...fixture.nativeElement.querySelectorAll("button")].find(
      (button: HTMLButtonElement) => button.textContent?.includes("Next"),
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe(1);
  });

  it("renders mosaic captions and tags", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.layout = "mosaic";
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector(".atr-image-gallery__mosaic")).toBeTruthy();
    expect(host.textContent).toContain("One");
    expect(host.textContent).toContain("North");
    expect(host.textContent).toContain("nature");
  });
});
