import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeContentSwitcherHarness extends ComponentHarness {
  static hostSelector = "atr-content-switcher";

  async getActiveItemIndex(): Promise<number> {
    const buttons = await this.locatorForAll(
      "tui-segmented > button, tui-segmented > a",
    )();
    for (let index = 0; index < buttons.length; index += 1) {
      const pressed = await buttons[index]?.getAttribute("aria-pressed");
      const current = await buttons[index]?.getAttribute("aria-current");
      if (pressed === "true" || current === "true" || current === "page") {
        return index;
      }
    }
    return 0;
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getAttribute("data-disabled") !== null;
  }

  async getOptionCount(): Promise<number> {
    return (
      await this.locatorForAll("tui-segmented > button, tui-segmented > a")()
    ).length;
  }
}
