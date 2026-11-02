import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeCarouselHarness extends ComponentHarness {
  static hostSelector = "atr-carousel";
  async getActiveSlide(): Promise<string> { return (await this.locatorFor('.atr-carousel__slide:not([hidden])')()).text(); }
  async next(): Promise<void> { await (await this.locatorFor('button[aria-label="Next slide"]')()).click(); }
  async previous(): Promise<void> { await (await this.locatorFor('button[aria-label="Previous slide"]')()).click(); }
  async goToSlide(index: number): Promise<void> { await (await this.locatorFor(`button[aria-label="Go to slide ${index + 1}"]`)()).click(); }
  async pause(): Promise<void> { const control = await this.locatorForOptional('button[aria-label="Pause automatic slides"]')(); if (control) await control.click(); }
  async resume(): Promise<void> { const control = await this.locatorForOptional('button[aria-label="Resume automatic slides"]')(); if (control) await control.click(); }
}
