import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeTableHarness extends ComponentHarness {
  static hostSelector = "atr-table";
  async getRows(): Promise<string[][]> { return Promise.all((await this.locatorForAll("tbody tr:not(.atr-table__detail)")()).map(async row => [await row.text()])); }
  async getCells(row: number): Promise<string[]> { return [await (await this.locatorForAll("tbody tr:not(.atr-table__detail)")())[row].text()]; }
  async sort(name: string): Promise<void> { await (await this.locatorFor(`th button[aria-label^="Sort ${name}"]`)()).click(); }
  async selectRow(row: number): Promise<void> { await (await this.locatorForAll('tbody input[type="checkbox"]')())[row].click(); }
  async expandRow(row: number): Promise<void> { await (await this.locatorForAll(".atr-table__expander")())[row].click(); }
  async getState(): Promise<"loading" | "empty" | "error" | "ready"> { const text = await this.host().then(h => h.text()); return text.includes("Loading rows") ? "loading" : text.includes("No rows") ? "empty" : (await this.locatorForOptional('[role="alert"]')()) ? "error" : "ready"; }
}
