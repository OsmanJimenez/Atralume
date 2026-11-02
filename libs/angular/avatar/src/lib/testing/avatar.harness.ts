import { ComponentHarness } from "@angular/cdk/testing";
class AtralumeAvatarImageHarness extends ComponentHarness {
  static hostSelector = "img";
}
export class AtralumeAvatarHarness extends ComponentHarness {
  static hostSelector = ".atr-avatar";
  async getName(): Promise<string | null> {
    return (await this.host()).getAttribute("data-name");
  }
  async getInitials(): Promise<string | null> {
    return (await this.host()).getAttribute("data-initials");
  }
  async getSize(): Promise<string | null> {
    return (await this.host()).getAttribute("data-size");
  }
  async hasImage(): Promise<boolean> {
    return (
      (await this.locatorForOptional(AtralumeAvatarImageHarness)()) !== null
    );
  }
}
