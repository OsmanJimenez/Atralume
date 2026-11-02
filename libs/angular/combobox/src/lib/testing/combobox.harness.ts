import { ComponentHarness, TestKey } from "@angular/cdk/testing";
import { AtralumeOptionHarness } from "@atralume/angular/listbox";
export class AtralumeComboboxHarness extends ComponentHarness {
  static hostSelector = "atr-combobox";
  protected readonly control = this.locatorFor('[role="combobox"]');
  async isOpen(): Promise<boolean> {
    return (await this.control())
      .getAttribute("aria-expanded")
      .then((value) => value === "true");
  }
  async open(): Promise<void> {
    if (!(await this.isOpen()))
      await (await this.control()).sendKeys(TestKey.DOWN_ARROW);
  }
  async close(): Promise<void> {
    await (await this.control()).sendKeys(TestKey.ESCAPE);
  }
  async isDisabled(): Promise<boolean> {
    return !!(await (await this.control()).getProperty<boolean>("disabled"));
  }
  async getValue(): Promise<string> {
    const control = await this.control();
    return (
      (await control.getProperty<string>("value")) || (await control.text())
    );
  }
  async enterText(value: string): Promise<void> {
    const input = await this.locatorFor('input[role="combobox"]')();
    await input.clear();
    await input.sendKeys(value);
  }
  async getOptions(): Promise<AtralumeOptionHarness[]> {
    const id = await (await this.control()).getAttribute("aria-controls");
    if (!id) return [];
    return this.documentRootLocatorFactory().locatorForAll(
      AtralumeOptionHarness.with({ ancestor: "#" + id }),
    )();
  }
  async selectOption(label: string): Promise<void> {
    await this.open();
    const options = await this.getOptions();
    for (const option of options)
      if ((await option.getLabel()) === label) {
        await option.select();
        return;
      }
    throw new Error("Option not found: " + label);
  }
  async clear(): Promise<void> {
    await (await this.locatorFor('button[aria-label^="Clear "]')()).click();
  }
  async isMultiple(): Promise<boolean> {
    await this.open();
    const id = await (await this.control()).getAttribute("aria-controls");
    return id
      ? (await this.documentRootLocatorFactory().locatorFor("#" + id)())
          .getAttribute("aria-multiselectable")
          .then((value) => value === "true")
      : false;
  }
  async isLoading(): Promise<boolean> {
    return (
      (
        await this.documentRootLocatorFactory().locatorForAll(
          "atr-progress-spinner",
        )()
      ).length > 0
    );
  }
  async getEmptyState(): Promise<string | null> {
    const states = await this.documentRootLocatorFactory().locatorForAll(
      '.atr-combobox-popup p[role="status"]',
    )();
    return states.length ? states[0].text() : null;
  }
}
