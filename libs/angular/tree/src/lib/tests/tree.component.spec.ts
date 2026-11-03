import { TestBed } from "@angular/core/testing";
import { AtralumeTree, type AtralumeTreeNode } from "../../index";
describe("AtralumeTree", () => {
  it("renders tui-tree and keeps selection outside consumer nodes", () => {
    const fixture = TestBed.createComponent(AtralumeTree<string>);
    const nodes: AtralumeTreeNode<string>[] = [
      {
        value: "root",
        label: "Root",
        children: [{ value: "child", label: "Child" }],
      },
    ];
    fixture.componentRef.setInput("nodes", nodes);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tui-tree")).toBeTruthy();
    const root = nodes[0];
    fixture.componentInstance.select(root, new Event("click"));
    expect(fixture.componentInstance.selected()).toEqual(["root"]);
    expect(nodes[0]).not.toHaveProperty("selected");
  });
});
