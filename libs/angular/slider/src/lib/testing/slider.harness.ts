import { ComponentHarness } from "@angular/cdk/testing";
import type { AtralumeSliderRange } from "../internal/slider-base";
export class AtralumeSliderHarness extends ComponentHarness {
  static hostSelector = "atr-slider";
  private readonly input = this.locatorFor('input[type="range"]');
  async getValue(): Promise<number> {
    return Number(await (await this.input()).getProperty<string>("value"));
  }
  async setValue(value: number): Promise<void> {
    const input = await this.input();
    await input.setInputValue(String(value));
    await input.dispatchEvent("input");
  }
  async increment(): Promise<void> {
    await this.setValue(
      (await this.getValue()) +
        (Number(await (await this.input()).getProperty<string>("step")) || 1),
    );
  }
  async decrement(): Promise<void> {
    await this.setValue(
      (await this.getValue()) -
        (Number(await (await this.input()).getProperty<string>("step")) || 1),
    );
  }
  async getThumbLabels(): Promise<string[]> {
    const label = await this.locatorFor("label")();
    return [await label.text()];
  }
  async isDisabled(): Promise<boolean> {
    return (await this.input()).getProperty<boolean>("disabled");
  }
}
export class AtralumeRangeSliderHarness extends ComponentHarness {
  static hostSelector = "atr-range-slider";
  private readonly range = this.locatorFor("tui-range");
  private readonly inputs = this.locatorForAll('tui-range input[type="range"]');
  async getValue(): Promise<AtralumeSliderRange> {
    const inputs = await this.inputs();
    return {
      start: Number(await inputs[0].getProperty<string>("value")),
      end: Number(await inputs[1].getProperty<string>("value")),
    };
  }
  async setValue(value: AtralumeSliderRange): Promise<void> {
    const inputs = await this.inputs();
    await inputs[0].setInputValue(String(value.start));
    await inputs[0].dispatchEvent("input");
    await inputs[1].setInputValue(String(value.end));
    await inputs[1].dispatchEvent("input");
  }
  async increment(thumb: "start" | "end" = "start"): Promise<void> {
    const inputs = await this.inputs();
    const input = inputs[thumb === "start" ? 0 : 1];
    await input.focus();
    await input.dispatchEvent("keydown", { key: "ArrowRight" });
  }
  async decrement(thumb: "start" | "end" = "start"): Promise<void> {
    const inputs = await this.inputs();
    const input = inputs[thumb === "start" ? 0 : 1];
    await input.focus();
    await input.dispatchEvent("keydown", { key: "ArrowLeft" });
  }
  async getThumbLabels(): Promise<string[]> {
    const host = await this.range();
    const label = (await host.getAttribute("aria-label")) ?? "";
    return [label + " start", label + " end"];
  }
  async isDisabled(): Promise<boolean> {
    return (await this.range()).hasClass("_disabled");
  }
}
