import { ComponentHarness } from "@angular/cdk/testing";
import { AtralumeAvatarHarness } from "./avatar.harness";

export class AtralumeAvatarGroupHarness extends ComponentHarness {
  static hostSelector = "atr-avatar-group.atr-avatar-group";

  async getDirection(): Promise<string | null> {
    const stack = await this.locatorForOptional("tui-avatar-stack")();
    return stack ? stack.getAttribute("data-direction") : null;
  }

  async getAvatars(): Promise<AtralumeAvatarHarness[]> {
    return this.locatorForAll(AtralumeAvatarHarness)();
  }
}
