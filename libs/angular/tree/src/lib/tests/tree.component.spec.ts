import { TestBed } from "@angular/core/testing";
import { AtralumeTree, type AtralumeTreeNode } from "../../index";
describe("AtralumeTree", () => {
  it("keeps selection and expansion outside consumer nodes", () => {
    const fixture = TestBed.createComponent(AtralumeTree<string>);
    const nodes: AtralumeTreeNode<string>[] = [{ value: "root", label: "Root", children: [{ value: "child", label: "Child" }] }];
    fixture.componentRef.setInput("nodes", nodes); fixture.detectChanges();
    const root = fixture.componentInstance.visible()[0]; fixture.componentInstance.toggle(root); fixture.componentInstance.select(root);
    expect(fixture.componentInstance.expanded()).toEqual(["root"]); expect(fixture.componentInstance.selected()).toEqual(["root"]); expect(nodes[0]).not.toHaveProperty("expanded");
  });
});
