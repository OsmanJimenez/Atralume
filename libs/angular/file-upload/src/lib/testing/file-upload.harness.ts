import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeFileUploadHarness extends ComponentHarness {
  static hostSelector = "atr-file-upload";
  async getFileNames(): Promise<string[]> {
    return Promise.all(
      (await this.locatorForAll(".atr-list-headline")()).map((item) =>
        item.text(),
      ),
    );
  }
  async removeFile(name: string): Promise<void> {
    const buttons = await this.locatorForAll("button[aria-label]")();
    for (const button of buttons)
      if ((await button.getAttribute("aria-label")) === "Remove " + name) {
        await button.click();
        return;
      }
    throw new Error("Selected file not found: " + name);
  }
  async getValidationErrors(): Promise<string[]> {
    return Promise.all(
      (
        await this.locatorForAll('[aria-label="File validation errors"] li')()
      ).map((item) => item.text()),
    );
  }
  async getStatuses(): Promise<string[]> {
    return Promise.all(
      (await this.locatorForAll(".atr-list-supporting")()).map((item) =>
        item.text(),
      ),
    );
  }
  async isDisabled(): Promise<boolean> {
    return (await this.locatorFor('input[type="file"]')()).getProperty<boolean>(
      "disabled",
    );
  }
}
