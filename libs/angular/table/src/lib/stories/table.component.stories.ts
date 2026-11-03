import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { AtralumeTable, type AtralumeTableColumn } from "../components/table/table.component";
interface Person { name: string; role: string; }
const rows: Person[] = [{ name: "Ada Lovelace", role: "Engineer" }, { name: "Grace Hopper", role: "Admiral" }];
const columns: AtralumeTableColumn<Person>[] = [{ id: "name", header: "Name", cell: row => row.name, sortable: true }, { id: "role", header: "Role", cell: row => row.role }];
const meta = { title: "Data/Table", component: AtralumeTable, decorators: [moduleMetadata({ imports: [AtralumeTable] })], args: { label: "People", rows, columns, selectionMode: "multiple", expandable: true, detail: (row: Person) => `${row.name} is a ${row.role}.` } } satisfies Meta<AtralumeTable<Person>>;
export default meta; type Story = StoryObj<AtralumeTable<Person>>;
export const Playground: Story = {
  args: { loading: false, error: "", rows },
  argTypes: {
    label: { control: "text" },
    loading: { control: "boolean" },
    error: { control: "text" },
    selectionMode: { control: "select", options: ["none", "single", "multiple"] },
    expandable: { control: "boolean" },
    rows: { control: false },
    columns: { control: false },
    detail: { control: false },
  },
};
