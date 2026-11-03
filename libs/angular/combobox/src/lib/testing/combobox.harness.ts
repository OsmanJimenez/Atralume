import { ComponentHarness, TestKey } from "@angular/cdk/testing";

export class AtralumeComboboxHarness extends ComponentHarness {
  static hostSelector = "atr-combobox";
  protected readonly control = this.locatorFor(
    'input[atrComboBox], input[tuiComboBox], input[role="combobox"], input',
  );

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
    const input = await this.control();
    await input.clear();
    await input.sendKeys(value);
  }

  async clear(): Promise<void> {
    const cleaner = this.locatorForOptional("button[tuiButtonX], [tuiButtonX]");
    const button = await cleaner();
    if (button) await button.click();
  }

  async selectOption(label: string): Promise<void> {
    await this.open();
    const options = await this.documentRootLocatorFactory().locatorForAll(
      'button[tuiOption], button[atrOption], [role="option"]',
    )();
    for (const option of options) {
      if ((await option.text()).trim() === label) {
        await option.click();
        return;
      }
    }
    throw new Error("Option not found: " + label);
  }
}
