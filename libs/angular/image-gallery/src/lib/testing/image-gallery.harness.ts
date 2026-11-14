import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeImageGalleryHarness extends ComponentHarness {
  static hostSelector = "atr-image-gallery";
  async next(): Promise<void> {
    await (await this.locatorFor('button:has-text("Next")')()).click();
  }
  async getIndex(): Promise<string> {
    return (await this.locatorFor(".atr-image-gallery__controls span")()).text();
  }
}
