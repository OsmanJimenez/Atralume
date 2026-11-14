import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeImagePreview } from "../../index";
@Component({
  imports: [AtralumeImagePreview],
  template: '<atr-image-preview [images]="images" />',
})
class Host {
  images = [{ src: "data:image/svg+xml,%3Csvg/%3E", alt: "Example" }];
}
@Component({
  imports: [AtralumeImagePreview],
  template: '<atr-image-preview [images]="[]" />',
})
class EmptyHost {}
describe("AtralumeImagePreview", () => {
  it("renders an accessible trigger and disables it when no images are supplied", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement.querySelector("button") as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    const emptyFixture = TestBed.createComponent(EmptyHost);
    emptyFixture.detectChanges();
    expect(
      (emptyFixture.nativeElement.querySelector("button") as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});
