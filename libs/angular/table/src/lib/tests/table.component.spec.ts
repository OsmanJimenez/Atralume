import { TestBed } from "@angular/core/testing";
import { AtralumeTable, type AtralumeTableColumn } from "../../index";
interface Row { id: number; name: string; }
describe("AtralumeTable", () => {
  it("controls sorting, visible selection and expansion without mutating rows", () => {
    const fixture = TestBed.createComponent(AtralumeTable<Row>);
    const rows = [{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }];
    const columns: AtralumeTableColumn<Row>[] = [{ id: "name", header: "Name", cell: row => row.name, sortable: true }];
    fixture.componentRef.setInput("rows", rows); fixture.componentRef.setInput("columns", columns); fixture.componentRef.setInput("selectionMode", "multiple"); fixture.componentRef.setInput("expandable", true); fixture.detectChanges();
    fixture.componentInstance.select(rows[0], 0); fixture.componentInstance.toggleExpanded(rows[0], 0); fixture.componentInstance.requestSort(columns[0]);
    expect(fixture.componentInstance.selected()).toEqual([rows[0]]); expect(fixture.componentInstance.expanded()).toEqual([rows[0]]); expect(fixture.componentInstance.sort()).toEqual({ active: "name", direction: "asc" }); expect(rows).toEqual([{ id: 1, name: "Ada" }, { id: 2, name: "Grace" }]);
  });
});
