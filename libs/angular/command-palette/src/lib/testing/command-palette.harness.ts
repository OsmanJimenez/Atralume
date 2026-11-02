import { ComponentHarness, TestKey } from "@angular/cdk/testing";
import { AtralumeComboboxHarness } from "@atralume/angular/combobox";
export class AtralumeCommandPaletteHarness extends ComponentHarness {
  static hostSelector = ".atr-command-palette-content";
  readonly combobox = this.locatorFor(AtralumeComboboxHarness);
  async search(query: string): Promise<void> {
    await (await this.combobox()).enterText(query);
  }
  async invoke(label: string): Promise<void> {
    await (await this.combobox()).selectOption(label);
  }
  async back(): Promise<void> {
    await (await this.locatorFor("button")()).click();
  }
  async close(): Promise<void> {
    await (await this.host()).sendKeys(TestKey.ESCAPE);
  }
}
