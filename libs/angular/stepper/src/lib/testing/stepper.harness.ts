import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeStepperHarness extends ComponentHarness {
  static hostSelector = "atr-stepper";
  private readonly headers = this.locatorForAll("button[data-step-header]");
  async getLabels(): Promise<string[]> {
    return Promise.all((await this.headers()).map((header) => header.text()));
  }
  async getActiveIndex(): Promise<number> {
    const headers = await this.headers();
    for (let index = 0; index < headers.length; index++)
      if ((await headers[index].getAttribute("aria-current")) === "step")
        return index;
    return -1;
  }
  async select(index: number): Promise<void> {
    const headers = await this.headers();
    if (!headers[index]) throw new Error("Step not found: " + index);
    await headers[index].click();
  }
  async next(): Promise<void> {
    await this.select((await this.getActiveIndex()) + 1);
  }
  async previous(): Promise<void> {
    await this.select((await this.getActiveIndex()) - 1);
  }
  async getContent(): Promise<string> {
    return (await this.locatorFor('[role="region"]')()).text();
  }
}
