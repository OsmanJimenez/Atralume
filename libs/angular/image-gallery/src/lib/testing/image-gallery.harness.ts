import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeImageGalleryHarness extends ComponentHarness {
  static hostSelector = "atr-image-gallery";

  async next(): Promise<void> {
    await (await this.locatorFor('button:has-text("Next")')()).click();
  }

  async getIndex(): Promise<string> {
    return (
      await this.locatorFor(".atr-image-gallery__controls span")()
    ).text();
  }

  async getTileCount(): Promise<number> {
    return (await this.locatorForAll(".atr-image-gallery__tile")()).length;
  }

  async getCaptionText(): Promise<string> {
    const captions = await this.locatorForAll(".atr-image-gallery__caption")();
    const texts = await Promise.all(captions.map((caption) => caption.text()));
    return texts.join(" ").trim();
  }
}
