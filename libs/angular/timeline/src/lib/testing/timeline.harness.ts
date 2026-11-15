import { ComponentHarness } from "@angular/cdk/testing";

export class AtralumeTimelineHarness extends ComponentHarness {
  static hostSelector = "atr-timeline";

  async getOrientation(): Promise<string | null> {
    return (await this.host()).getAttribute("data-orientation");
  }

  async getItemCount(): Promise<number> {
    return (await this.locatorForAll("label[tuiTimelineItem]")()).length;
  }
}
