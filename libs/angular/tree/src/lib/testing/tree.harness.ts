import { ComponentHarness } from "@angular/cdk/testing";
export class AtralumeTreeHarness extends ComponentHarness {
  static hostSelector = "atr-tree";
  async getNodes(): Promise<string[]> { return Promise.all((await this.locatorForAll('[role="treeitem"]')()).map(node => node.text())); }
  async expand(name: string): Promise<void> { await (await this.locatorFor(`button[aria-label="Expand ${name}"]`)()).click(); }
  async collapse(name: string): Promise<void> { await (await this.locatorFor(`button[aria-label="Collapse ${name}"]`)()).click(); }
  async select(name: string): Promise<void> { await (await this.locatorFor(`[role="treeitem"][aria-label="${name}"]`)()).click(); }
}
