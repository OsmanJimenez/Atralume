import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeIconButtonHarness extends ComponentHarness {
  static hostSelector = ".atr-icon-button";
  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>("disabled");
  }
  async click(): Promise<void> {
    await (await this.host()).click();
  }
  async getAccessibleName(): Promise<string | null> {
    const host = await this.host();
    const ids = (await host.getAttribute("aria-labelledby"))?.split(/\s+/);
    if (ids?.length) {
      const labels = await Promise.all(
        ids.filter(Boolean).map(async (id) => {
          const label =
            await this.documentRootLocatorFactory().locatorForOptional(
              "[id=" + JSON.stringify(id) + "]",
            )();
          return label ? label.text() : "";
        }),
      );
      return labels.join(" ");
    }
    return (await host.getAttribute("aria-label")) ?? (await host.text());
  }
}
