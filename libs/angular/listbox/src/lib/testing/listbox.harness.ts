import {
  ComponentHarness,
  HarnessPredicate,
  TestKey,
  type BaseHarnessFilters,
} from "@angular/cdk/testing";
export interface AtralumeOptionHarnessFilters extends BaseHarnessFilters {
  label?: string | RegExp;
}
export class AtralumeOptionHarness extends ComponentHarness {
  static hostSelector = "atr-option";
  static with(
    options: AtralumeOptionHarnessFilters = {},
  ): HarnessPredicate<AtralumeOptionHarness> {
    return new HarnessPredicate(AtralumeOptionHarness, options).addOption(
      "label",
      options.label,
      (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label),
    );
  }
  async getLabel(): Promise<string> {
    return (await this.host())
      .getAttribute("aria-label")
      .then((label) => label ?? "");
  }
  async isSelected(): Promise<boolean> {
    return (await this.host())
      .getAttribute("aria-selected")
      .then((value) => value === "true");
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host())
      .getAttribute("aria-disabled")
      .then((value) => value === "true");
  }
  async select(): Promise<void> {
    await (await this.host()).click();
  }
}
export class AtralumeListboxHarness extends ComponentHarness {
  static hostSelector = "atr-listbox";
  getOptions = this.locatorForAll(AtralumeOptionHarness);
  async getSelectedOptions(): Promise<AtralumeOptionHarness[]> {
    const options = await this.getOptions();
    const selected = await Promise.all(
      options.map((option) => option.isSelected()),
    );
    return options.filter((_, index) => selected[index]);
  }
  async selectOption(label: string): Promise<void> {
    await (
      await this.locatorFor(AtralumeOptionHarness.with({ label }))()
    ).select();
  }
  async isMultiple(): Promise<boolean> {
    return (await this.host())
      .getAttribute("aria-multiselectable")
      .then((value) => value === "true");
  }
  async isDisabled(): Promise<boolean> {
    return (await this.host())
      .getAttribute("aria-disabled")
      .then((value) => value === "true");
  }
  async navigate(key: TestKey): Promise<void> {
    await (await this.host()).sendKeys(key);
  }
}
